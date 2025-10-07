import { supabaseAdmin } from '../supabase/config';
import type { Language } from '../translations';

// Email template types
export type EmailTemplate =
  | 'order_placed'
  | 'order_confirmed'
  | 'order_preparing'
  | 'order_ready_for_pickup'
  | 'order_assigned'
  | 'order_in_transit'
  | 'order_delivered'
  | 'order_cancelled'
  | 'restaurant_approved'
  | 'restaurant_suspended'
  | 'driver_approved'
  | 'driver_suspended'
  | 'password_reset'
  | 'welcome';

interface EmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email using Supabase Auth email service
 * Note: In production, you may want to use a dedicated email service like SendGrid or Resend
 */
async function sendEmail(params: EmailParams): Promise<void> {
  const { to, subject, html, text } = params;

  try {
    // For now, we'll log the email since Supabase Auth email is primarily for auth flows
    // In production, integrate with SendGrid, Resend, or another email service
    console.log('Email would be sent:', {
      to,
      subject,
      preview: html.substring(0, 100),
    });

    // TODO: Integrate with actual email service
    // Example with SendGrid:
    // await sendgrid.send({ to, subject, html, text });
    
    // For development, we can use Supabase's built-in email for auth-related emails
    // For other emails, you'll need to integrate a proper email service
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
}

/**
 * Get email translations for different languages
 */
const emailTranslations = {
  en: {
    order_placed: {
      subject: 'Order Placed Successfully',
      greeting: 'Hello',
      body: 'Your order has been placed successfully.',
      orderNumber: 'Order Number',
      total: 'Total',
      viewOrder: 'View Order',
      footer: 'Thank you for ordering with EatAfrican!',
    },
    order_confirmed: {
      subject: 'Order Confirmed',
      greeting: 'Hello',
      body: 'Your order has been confirmed by the restaurant.',
      orderNumber: 'Order Number',
      estimatedTime: 'Estimated Delivery Time',
      footer: 'Thank you for your patience!',
    },
    order_preparing: {
      subject: 'Order is Being Prepared',
      greeting: 'Hello',
      body: 'The restaurant is now preparing your order.',
      orderNumber: 'Order Number',
      footer: 'Your food will be ready soon!',
    },
    order_ready_for_pickup: {
      subject: 'Order Ready for Pickup',
      greeting: 'Hello',
      body: 'Your order is ready and waiting for a driver.',
      orderNumber: 'Order Number',
      footer: 'A driver will pick it up shortly!',
    },
    order_assigned: {
      subject: 'Driver Assigned to Your Order',
      greeting: 'Hello',
      body: 'A driver has been assigned to deliver your order.',
      orderNumber: 'Order Number',
      driverName: 'Driver',
      footer: 'Your order is on its way!',
    },
    order_in_transit: {
      subject: 'Order Out for Delivery',
      greeting: 'Hello',
      body: 'Your order is now out for delivery.',
      orderNumber: 'Order Number',
      footer: 'Your food will arrive soon!',
    },
    order_delivered: {
      subject: 'Order Delivered',
      greeting: 'Hello',
      body: 'Your order has been delivered successfully.',
      orderNumber: 'Order Number',
      footer: 'Enjoy your meal!',
    },
    order_cancelled: {
      subject: 'Order Cancelled',
      greeting: 'Hello',
      body: 'Your order has been cancelled.',
      orderNumber: 'Order Number',
      footer: 'If you have any questions, please contact us.',
    },
    restaurant_approved: {
      subject: 'Restaurant Approved - Welcome to EatAfrican!',
      greeting: 'Hello',
      body: 'Congratulations! Your restaurant has been approved.',
      accessDashboard: 'Access Your Dashboard',
      footer: 'We look forward to working with you!',
    },
    restaurant_suspended: {
      subject: 'Restaurant Account Suspended',
      greeting: 'Hello',
      body: 'Your restaurant account has been suspended.',
      footer: 'Please contact support for more information.',
    },
    driver_approved: {
      subject: 'Driver Application Approved',
      greeting: 'Hello',
      body: 'Congratulations! Your driver application has been approved.',
      startDelivering: 'Start Delivering',
      footer: 'Welcome to the EatAfrican delivery team!',
    },
    driver_suspended: {
      subject: 'Driver Account Suspended',
      greeting: 'Hello',
      body: 'Your driver account has been suspended.',
      footer: 'Please contact support for more information.',
    },
    password_reset: {
      subject: 'Reset Your Password',
      greeting: 'Hello',
      body: 'You requested to reset your password.',
      resetButton: 'Reset Password',
      expiry: 'This link will expire in 1 hour.',
      footer: 'If you did not request this, please ignore this email.',
    },
    welcome: {
      subject: 'Welcome to EatAfrican!',
      greeting: 'Hello',
      body: 'Welcome to EatAfrican! We are excited to have you.',
      exploreRestaurants: 'Explore Restaurants',
      footer: 'Enjoy authentic African cuisine delivered to your door!',
    },
  },
  de: {
    order_placed: {
      subject: 'Bestellung erfolgreich aufgegeben',
      greeting: 'Hallo',
      body: 'Ihre Bestellung wurde erfolgreich aufgegeben.',
      orderNumber: 'Bestellnummer',
      total: 'Gesamt',
      viewOrder: 'Bestellung ansehen',
      footer: 'Vielen Dank für Ihre Bestellung bei EatAfrican!',
    },
    order_confirmed: {
      subject: 'Bestellung bestätigt',
      greeting: 'Hallo',
      body: 'Ihre Bestellung wurde vom Restaurant bestätigt.',
      orderNumber: 'Bestellnummer',
      estimatedTime: 'Voraussichtliche Lieferzeit',
      footer: 'Vielen Dank für Ihre Geduld!',
    },
    order_preparing: {
      subject: 'Bestellung wird zubereitet',
      greeting: 'Hallo',
      body: 'Das Restaurant bereitet jetzt Ihre Bestellung zu.',
      orderNumber: 'Bestellnummer',
      footer: 'Ihr Essen ist bald fertig!',
    },
    order_ready_for_pickup: {
      subject: 'Bestellung abholbereit',
      greeting: 'Hallo',
      body: 'Ihre Bestellung ist fertig und wartet auf einen Fahrer.',
      orderNumber: 'Bestellnummer',
      footer: 'Ein Fahrer wird sie in Kürze abholen!',
    },
    order_assigned: {
      subject: 'Fahrer Ihrer Bestellung zugewiesen',
      greeting: 'Hallo',
      body: 'Ein Fahrer wurde beauftragt, Ihre Bestellung zu liefern.',
      orderNumber: 'Bestellnummer',
      driverName: 'Fahrer',
      footer: 'Ihre Bestellung ist unterwegs!',
    },
    order_in_transit: {
      subject: 'Bestellung wird ausgeliefert',
      greeting: 'Hallo',
      body: 'Ihre Bestellung wird jetzt ausgeliefert.',
      orderNumber: 'Bestellnummer',
      footer: 'Ihr Essen kommt bald an!',
    },
    order_delivered: {
      subject: 'Bestellung zugestellt',
      greeting: 'Hallo',
      body: 'Ihre Bestellung wurde erfolgreich zugestellt.',
      orderNumber: 'Bestellnummer',
      footer: 'Guten Appetit!',
    },
    order_cancelled: {
      subject: 'Bestellung storniert',
      greeting: 'Hallo',
      body: 'Ihre Bestellung wurde storniert.',
      orderNumber: 'Bestellnummer',
      footer: 'Bei Fragen kontaktieren Sie uns bitte.',
    },
    restaurant_approved: {
      subject: 'Restaurant genehmigt - Willkommen bei EatAfrican!',
      greeting: 'Hallo',
      body: 'Herzlichen Glückwunsch! Ihr Restaurant wurde genehmigt.',
      accessDashboard: 'Zugriff auf Ihr Dashboard',
      footer: 'Wir freuen uns auf die Zusammenarbeit!',
    },
    restaurant_suspended: {
      subject: 'Restaurant-Konto gesperrt',
      greeting: 'Hallo',
      body: 'Ihr Restaurant-Konto wurde gesperrt.',
      footer: 'Bitte kontaktieren Sie den Support für weitere Informationen.',
    },
    driver_approved: {
      subject: 'Fahrer-Bewerbung genehmigt',
      greeting: 'Hallo',
      body: 'Herzlichen Glückwunsch! Ihre Fahrer-Bewerbung wurde genehmigt.',
      startDelivering: 'Mit Lieferungen beginnen',
      footer: 'Willkommen im EatAfrican-Lieferteam!',
    },
    driver_suspended: {
      subject: 'Fahrer-Konto gesperrt',
      greeting: 'Hallo',
      body: 'Ihr Fahrer-Konto wurde gesperrt.',
      footer: 'Bitte kontaktieren Sie den Support für weitere Informationen.',
    },
    password_reset: {
      subject: 'Passwort zurücksetzen',
      greeting: 'Hallo',
      body: 'Sie haben das Zurücksetzen Ihres Passworts angefordert.',
      resetButton: 'Passwort zurücksetzen',
      expiry: 'Dieser Link läuft in 1 Stunde ab.',
      footer: 'Wenn Sie dies nicht angefordert haben, ignorieren Sie diese E-Mail.',
    },
    welcome: {
      subject: 'Willkommen bei EatAfrican!',
      greeting: 'Hallo',
      body: 'Willkommen bei EatAfrican! Wir freuen uns, Sie bei uns zu haben.',
      exploreRestaurants: 'Restaurants erkunden',
      footer: 'Genießen Sie authentische afrikanische Küche direkt zu Ihnen nach Hause!',
    },
  },
  fr: {
    order_placed: {
      subject: 'Commande passée avec succès',
      greeting: 'Bonjour',
      body: 'Votre commande a été passée avec succès.',
      orderNumber: 'Numéro de commande',
      total: 'Total',
      viewOrder: 'Voir la commande',
      footer: 'Merci d\'avoir commandé chez EatAfrican!',
    },
    order_confirmed: {
      subject: 'Commande confirmée',
      greeting: 'Bonjour',
      body: 'Votre commande a été confirmée par le restaurant.',
      orderNumber: 'Numéro de commande',
      estimatedTime: 'Heure de livraison estimée',
      footer: 'Merci pour votre patience!',
    },
    order_preparing: {
      subject: 'Commande en préparation',
      greeting: 'Bonjour',
      body: 'Le restaurant prépare maintenant votre commande.',
      orderNumber: 'Numéro de commande',
      footer: 'Votre nourriture sera bientôt prête!',
    },
    order_ready_for_pickup: {
      subject: 'Commande prête pour le ramassage',
      greeting: 'Bonjour',
      body: 'Votre commande est prête et attend un livreur.',
      orderNumber: 'Numéro de commande',
      footer: 'Un livreur viendra la chercher sous peu!',
    },
    order_assigned: {
      subject: 'Livreur assigné à votre commande',
      greeting: 'Bonjour',
      body: 'Un livreur a été assigné pour livrer votre commande.',
      orderNumber: 'Numéro de commande',
      driverName: 'Livreur',
      footer: 'Votre commande est en route!',
    },
    order_in_transit: {
      subject: 'Commande en cours de livraison',
      greeting: 'Bonjour',
      body: 'Votre commande est maintenant en cours de livraison.',
      orderNumber: 'Numéro de commande',
      footer: 'Votre nourriture arrivera bientôt!',
    },
    order_delivered: {
      subject: 'Commande livrée',
      greeting: 'Bonjour',
      body: 'Votre commande a été livrée avec succès.',
      orderNumber: 'Numéro de commande',
      footer: 'Bon appétit!',
    },
    order_cancelled: {
      subject: 'Commande annulée',
      greeting: 'Bonjour',
      body: 'Votre commande a été annulée.',
      orderNumber: 'Numéro de commande',
      footer: 'Si vous avez des questions, veuillez nous contacter.',
    },
    restaurant_approved: {
      subject: 'Restaurant approuvé - Bienvenue chez EatAfrican!',
      greeting: 'Bonjour',
      body: 'Félicitations! Votre restaurant a été approuvé.',
      accessDashboard: 'Accéder à votre tableau de bord',
      footer: 'Nous sommes impatients de travailler avec vous!',
    },
    restaurant_suspended: {
      subject: 'Compte restaurant suspendu',
      greeting: 'Bonjour',
      body: 'Votre compte restaurant a été suspendu.',
      footer: 'Veuillez contacter le support pour plus d\'informations.',
    },
    driver_approved: {
      subject: 'Candidature de livreur approuvée',
      greeting: 'Bonjour',
      body: 'Félicitations! Votre candidature de livreur a été approuvée.',
      startDelivering: 'Commencer à livrer',
      footer: 'Bienvenue dans l\'équipe de livraison EatAfrican!',
    },
    driver_suspended: {
      subject: 'Compte livreur suspendu',
      greeting: 'Bonjour',
      body: 'Votre compte livreur a été suspendu.',
      footer: 'Veuillez contacter le support pour plus d\'informations.',
    },
    password_reset: {
      subject: 'Réinitialiser votre mot de passe',
      greeting: 'Bonjour',
      body: 'Vous avez demandé à réinitialiser votre mot de passe.',
      resetButton: 'Réinitialiser le mot de passe',
      expiry: 'Ce lien expirera dans 1 heure.',
      footer: 'Si vous n\'avez pas demandé cela, veuillez ignorer cet e-mail.',
    },
    welcome: {
      subject: 'Bienvenue chez EatAfrican!',
      greeting: 'Bonjour',
      body: 'Bienvenue chez EatAfrican! Nous sommes ravis de vous avoir.',
      exploreRestaurants: 'Explorer les restaurants',
      footer: 'Profitez de la cuisine africaine authentique livrée à votre porte!',
    },
  },
  it: {
    order_placed: {
      subject: 'Ordine effettuato con successo',
      greeting: 'Ciao',
      body: 'Il tuo ordine è stato effettuato con successo.',
      orderNumber: 'Numero ordine',
      total: 'Totale',
      viewOrder: 'Visualizza ordine',
      footer: 'Grazie per aver ordinato con EatAfrican!',
    },
    order_confirmed: {
      subject: 'Ordine confermato',
      greeting: 'Ciao',
      body: 'Il tuo ordine è stato confermato dal ristorante.',
      orderNumber: 'Numero ordine',
      estimatedTime: 'Tempo di consegna stimato',
      footer: 'Grazie per la pazienza!',
    },
    order_preparing: {
      subject: 'Ordine in preparazione',
      greeting: 'Ciao',
      body: 'Il ristorante sta preparando il tuo ordine.',
      orderNumber: 'Numero ordine',
      footer: 'Il tuo cibo sarà pronto presto!',
    },
    order_ready_for_pickup: {
      subject: 'Ordine pronto per il ritiro',
      greeting: 'Ciao',
      body: 'Il tuo ordine è pronto e in attesa di un autista.',
      orderNumber: 'Numero ordine',
      footer: 'Un autista lo ritirerà a breve!',
    },
    order_assigned: {
      subject: 'Autista assegnato al tuo ordine',
      greeting: 'Ciao',
      body: 'Un autista è stato assegnato per consegnare il tuo ordine.',
      orderNumber: 'Numero ordine',
      driverName: 'Autista',
      footer: 'Il tuo ordine è in arrivo!',
    },
    order_in_transit: {
      subject: 'Ordine in consegna',
      greeting: 'Ciao',
      body: 'Il tuo ordine è ora in consegna.',
      orderNumber: 'Numero ordine',
      footer: 'Il tuo cibo arriverà presto!',
    },
    order_delivered: {
      subject: 'Ordine consegnato',
      greeting: 'Ciao',
      body: 'Il tuo ordine è stato consegnato con successo.',
      orderNumber: 'Numero ordine',
      footer: 'Buon appetito!',
    },
    order_cancelled: {
      subject: 'Ordine annullato',
      greeting: 'Ciao',
      body: 'Il tuo ordine è stato annullato.',
      orderNumber: 'Numero ordine',
      footer: 'Se hai domande, contattaci.',
    },
    restaurant_approved: {
      subject: 'Ristorante approvato - Benvenuto su EatAfrican!',
      greeting: 'Ciao',
      body: 'Congratulazioni! Il tuo ristorante è stato approvato.',
      accessDashboard: 'Accedi alla tua dashboard',
      footer: 'Non vediamo l\'ora di lavorare con te!',
    },
    restaurant_suspended: {
      subject: 'Account ristorante sospeso',
      greeting: 'Ciao',
      body: 'Il tuo account ristorante è stato sospeso.',
      footer: 'Contatta il supporto per ulteriori informazioni.',
    },
    driver_approved: {
      subject: 'Candidatura autista approvata',
      greeting: 'Ciao',
      body: 'Congratulazioni! La tua candidatura come autista è stata approvata.',
      startDelivering: 'Inizia a consegnare',
      footer: 'Benvenuto nel team di consegna EatAfrican!',
    },
    driver_suspended: {
      subject: 'Account autista sospeso',
      greeting: 'Ciao',
      body: 'Il tuo account autista è stato sospeso.',
      footer: 'Contatta il supporto per ulteriori informazioni.',
    },
    password_reset: {
      subject: 'Reimposta la tua password',
      greeting: 'Ciao',
      body: 'Hai richiesto di reimpostare la tua password.',
      resetButton: 'Reimposta password',
      expiry: 'Questo link scadrà tra 1 ora.',
      footer: 'Se non hai richiesto questo, ignora questa email.',
    },
    welcome: {
      subject: 'Benvenuto su EatAfrican!',
      greeting: 'Ciao',
      body: 'Benvenuto su EatAfrican! Siamo entusiasti di averti.',
      exploreRestaurants: 'Esplora i ristoranti',
      footer: 'Goditi la cucina africana autentica consegnata a casa tua!',
    },
  },
};

/**
 * Generate HTML email template
 */
function generateEmailHTML(
  template: EmailTemplate,
  language: Language,
  data: Record<string, any>
): string {
  const translations = emailTranslations[language] || emailTranslations.en;
  const templateData = translations[template as keyof typeof translations] as any;

  if (!templateData) {
    throw new Error(`Email template not found: ${template}`);
  }

  const baseURL = process.env.FRONTEND_URL || 'http://localhost:3000';

  // Basic HTML email template
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${templateData.subject}</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #FF6B35;
      color: white;
      padding: 20px;
      text-align: center;
      border-radius: 5px 5px 0 0;
    }
    .content {
      background-color: #f9f9f9;
      padding: 30px;
      border-radius: 0 0 5px 5px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #FF6B35;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #ddd;
      color: #666;
      font-size: 14px;
    }
    .info-box {
      background-color: white;
      padding: 15px;
      border-left: 4px solid #FF6B35;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>EatAfrican</h1>
  </div>
  <div class="content">
    <p>${templateData.greeting} ${data.name || ''},</p>
    <p>${templateData.body}</p>
    
    ${data.orderNumber ? `
      <div class="info-box">
        <strong>${templateData.orderNumber}:</strong> ${data.orderNumber}
        ${data.total ? `<br><strong>${templateData.total}:</strong> Fr. ${data.total}.-` : ''}
        ${data.estimatedTime ? `<br><strong>${templateData.estimatedTime}:</strong> ${data.estimatedTime}` : ''}
        ${data.driverName ? `<br><strong>${templateData.driverName}:</strong> ${data.driverName}` : ''}
      </div>
    ` : ''}
    
    ${data.actionUrl ? `
      <a href="${data.actionUrl}" class="button">
        ${templateData.viewOrder || templateData.accessDashboard || templateData.startDelivering || templateData.resetButton || templateData.exploreRestaurants}
      </a>
    ` : ''}
    
    ${templateData.expiry ? `<p style="color: #666; font-size: 14px;">${templateData.expiry}</p>` : ''}
    
    <div class="footer">
      <p>${templateData.footer}</p>
      <p>EatAfrican - Authentic African Cuisine</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Generate plain text email
 */
function generateEmailText(
  template: EmailTemplate,
  language: Language,
  data: Record<string, any>
): string {
  const translations = emailTranslations[language] || emailTranslations.en;
  const templateData = translations[template as keyof typeof translations] as any;

  if (!templateData) {
    throw new Error(`Email template not found: ${template}`);
  }

  let text = `${templateData.greeting} ${data.name || ''},\n\n`;
  text += `${templateData.body}\n\n`;

  if (data.orderNumber) {
    text += `${templateData.orderNumber}: ${data.orderNumber}\n`;
    if (data.total) text += `${templateData.total}: Fr. ${data.total}.-\n`;
    if (data.estimatedTime) text += `${templateData.estimatedTime}: ${data.estimatedTime}\n`;
    if (data.driverName) text += `${templateData.driverName}: ${data.driverName}\n`;
    text += '\n';
  }

  if (data.actionUrl) {
    text += `${data.actionUrl}\n\n`;
  }

  if (templateData.expiry) {
    text += `${templateData.expiry}\n\n`;
  }

  text += `${templateData.footer}\n\n`;
  text += 'EatAfrican - Authentic African Cuisine';

  return text;
}

/**
 * Send order status change email
 */
export async function sendOrderStatusEmail(params: {
  to: string;
  name: string;
  orderNumber: string;
  status: string;
  language?: Language;
  total?: number;
  estimatedTime?: string;
  driverName?: string;
  actionUrl?: string;
}): Promise<void> {
  const { to, name, orderNumber, status, language = 'en', total, estimatedTime, driverName, actionUrl } = params;

  // Map order status to email template
  const templateMap: Record<string, EmailTemplate> = {
    new: 'order_placed',
    confirmed: 'order_confirmed',
    preparing: 'order_preparing',
    ready_for_pickup: 'order_ready_for_pickup',
    assigned: 'order_assigned',
    in_transit: 'order_in_transit',
    delivered: 'order_delivered',
    cancelled: 'order_cancelled',
  };

  const template = templateMap[status];
  if (!template) {
    console.warn(`No email template for order status: ${status}`);
    return;
  }

  const data = { name, orderNumber, total, estimatedTime, driverName, actionUrl };
  const html = generateEmailHTML(template, language, data);
  const text = generateEmailText(template, language, data);
  const translations = emailTranslations[language] || emailTranslations.en;
  const subject = (translations[template as keyof typeof translations] as any).subject;

  await sendEmail({ to, subject, html, text });
}

/**
 * Send account-related email
 */
export async function sendAccountEmail(params: {
  to: string;
  name: string;
  template: 'restaurant_approved' | 'restaurant_suspended' | 'driver_approved' | 'driver_suspended' | 'welcome';
  language?: Language;
  actionUrl?: string;
}): Promise<void> {
  const { to, name, template, language = 'en', actionUrl } = params;

  const data = { name, actionUrl };
  const html = generateEmailHTML(template, language, data);
  const text = generateEmailText(template, language, data);
  const translations = emailTranslations[language] || emailTranslations.en;
  const subject = (translations[template as keyof typeof translations] as any).subject;

  await sendEmail({ to, subject, html, text });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(params: {
  to: string;
  name: string;
  resetUrl: string;
  language?: Language;
}): Promise<void> {
  const { to, name, resetUrl, language = 'en' } = params;

  const data = { name, actionUrl: resetUrl };
  const html = generateEmailHTML('password_reset', language, data);
  const text = generateEmailText('password_reset', language, data);
  const translations = emailTranslations[language] || emailTranslations.en;
  const subject = (translations.password_reset as any).subject;

  await sendEmail({ to, subject, html, text });
}
