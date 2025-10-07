#!/usr/bin/env ts-node
/**
 * Data Export Script
 * 
 * This script exports data from the Supabase database to JSON files for backup purposes.
 * It exports all tables and saves them to a timestamped backup directory.
 * 
 * Usage:
 *   npm run export-data
 *   or
 *   ts-node scripts/export-data.ts
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
  console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Tables to export
const TABLES = [
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

interface ExportStats {
  table: string;
  count: number;
  success: boolean;
  error?: string;
}

async function exportTable(tableName: string): Promise<ExportStats> {
  try {
    console.log(`📊 Exporting ${tableName}...`);
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*');

    if (error) {
      throw error;
    }

    return {
      table: tableName,
      count: data?.length || 0,
      success: true
    };
  } catch (error: any) {
    console.error(`❌ Error exporting ${tableName}:`, error.message);
    return {
      table: tableName,
      count: 0,
      success: false,
      error: error.message
    };
  }
}

async function exportAllData() {
  console.log('🚀 Food Delivery Backend - Data Export Tool\n');
  console.log('📦 Starting data export...\n');

  // Create backup directory with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
  const backupDir = path.join(__dirname, '..', 'backups', `backup-${timestamp}`);
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  console.log(`📁 Backup directory: ${backupDir}\n`);

  const stats: ExportStats[] = [];
  const exportData: Record<string, any[]> = {};

  // Export each table
  for (const table of TABLES) {
    const stat = await exportTable(table);
    stats.push(stat);

    if (stat.success) {
      const { data } = await supabase.from(table).select('*');
      exportData[table] = data || [];
      
      // Save individual table file
      const tableFile = path.join(backupDir, `${table}.json`);
      fs.writeFileSync(tableFile, JSON.stringify(data, null, 2));
      
      console.log(`   ✅ Exported ${stat.count} records to ${table}.json`);
    }
  }

  // Save combined export file
  const combinedFile = path.join(backupDir, 'full-backup.json');
  fs.writeFileSync(combinedFile, JSON.stringify(exportData, null, 2));

  // Save export metadata
  const metadata = {
    exportDate: new Date().toISOString(),
    supabaseUrl,
    tables: stats,
    totalRecords: stats.reduce((sum, stat) => sum + stat.count, 0)
  };
  
  const metadataFile = path.join(backupDir, 'metadata.json');
  fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Export Summary');
  console.log('='.repeat(60));
  
  stats.forEach(stat => {
    const status = stat.success ? '✅' : '❌';
    console.log(`${status} ${stat.table.padEnd(25)} ${stat.count.toString().padStart(6)} records`);
  });

  console.log('='.repeat(60));
  console.log(`📦 Total records exported: ${metadata.totalRecords}`);
  console.log(`📁 Backup location: ${backupDir}`);
  console.log('='.repeat(60));

  const failedExports = stats.filter(s => !s.success);
  if (failedExports.length > 0) {
    console.log('\n⚠️  Some exports failed:');
    failedExports.forEach(stat => {
      console.log(`   ❌ ${stat.table}: ${stat.error}`);
    });
  } else {
    console.log('\n✅ All data exported successfully!');
  }
}

// Run the export
exportAllData().catch(error => {
  console.error('❌ Fatal error during export:', error);
  process.exit(1);
});
