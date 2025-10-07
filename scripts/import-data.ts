#!/usr/bin/env ts-node
/**
 * Data Import Script
 * 
 * This script imports data from JSON backup files into the Supabase database.
 * It can restore data from a previous export or migrate mock data.
 * 
 * Usage:
 *   npm run import-data <backup-directory>
 *   or
 *   ts-node scripts/import-data.ts backups/backup-2025-01-07
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Tables in order of dependencies (to avoid foreign key errors)
const IMPORT_ORDER = [
  'users',
  'restaurants',
  'menu_items',
  'drivers',
  'orders',
  'order_items',
  'loyalty_points',
  'loyalty_transactions',
  'vouchers',
  'favorites',
  'notifications',
  'activity_logs'
];

interface ImportStats {
  table: string;
  count: number;
  success: boolean;
  error?: string;
}

async function importTable(tableName: string, data: any[]): Promise<ImportStats> {
  try {
    console.log(`📥 Importing ${data.length} records into ${tableName}...`);
    
    if (data.length === 0) {
      return { table: tableName, count: 0, success: true };
    }

    // Insert data in batches to avoid timeout
    const batchSize = 100;
    let totalInserted = 0;

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      
      const { error } = await supabase
        .from(tableName)
        .upsert(batch, { onConflict: 'id' });

      if (error) {
        throw error;
      }

      totalInserted += batch.length;
      console.log(`   ⏳ Imported ${totalInserted}/${data.length} records...`);
    }

    return {
      table: tableName,
      count: totalInserted,
      success: true
    };
  } catch (error: any) {
    console.error(`❌ Error importing ${tableName}:`, error.message);
    return {
      table: tableName,
      count: 0,
      success: false,
      error: error.message
    };
  }
}

async function importAllData(backupDir: string) {
  console.log('🚀 Food Delivery Backend - Data Import Tool\n');
  console.log(`📦 Importing data from: ${backupDir}\n`);

  // Check if backup directory exists
  if (!fs.existsSync(backupDir)) {
    console.error(`❌ Error: Backup directory not found: ${backupDir}`);
    process.exit(1);
  }

  // Read metadata
  const metadataFile = path.join(backupDir, 'metadata.json');
  if (fs.existsSync(metadataFile)) {
    const metadata = JSON.parse(fs.readFileSync(metadataFile, 'utf-8'));
    console.log(`📅 Backup date: ${metadata.exportDate}`);
    console.log(`📊 Total records: ${metadata.totalRecords}\n`);
  }

  const stats: ImportStats[] = [];

  // Import each table in order
  for (const table of IMPORT_ORDER) {
    const tableFile = path.join(backupDir, `${table}.json`);
    
    if (!fs.existsSync(tableFile)) {
      console.log(`⚠️  Skipping ${table} (file not found)`);
      continue;
    }

    const data = JSON.parse(fs.readFileSync(tableFile, 'utf-8'));
    const stat = await importTable(table, data);
    stats.push(stat);

    if (stat.success) {
      console.log(`   ✅ Imported ${stat.count} records\n`);
    }
  }

  // Print summary
  console.log('='.repeat(60));
  console.log('📊 Import Summary');
  console.log('='.repeat(60));
  
  stats.forEach(stat => {
    const status = stat.success ? '✅' : '❌';
    console.log(`${status} ${stat.table.padEnd(25)} ${stat.count.toString().padStart(6)} records`);
  });

  console.log('='.repeat(60));
  console.log(`📦 Total records imported: ${stats.reduce((sum, s) => sum + s.count, 0)}`);
  console.log('='.repeat(60));

  const failedImports = stats.filter(s => !s.success);
  if (failedImports.length > 0) {
    console.log('\n⚠️  Some imports failed:');
    failedImports.forEach(stat => {
      console.log(`   ❌ ${stat.table}: ${stat.error}`);
    });
  } else {
    console.log('\n✅ All data imported successfully!');
  }
}

// Get backup directory from command line argument
const backupDir = process.argv[2];

if (!backupDir) {
  console.error('❌ Error: Please provide backup directory path');
  console.log('\nUsage:');
  console.log('  npm run import-data <backup-directory>');
  console.log('  ts-node scripts/import-data.ts backups/backup-2025-01-07');
  process.exit(1);
}

// Run the import
importAllData(backupDir).catch(error => {
  console.error('❌ Fatal error during import:', error);
  process.exit(1);
});
