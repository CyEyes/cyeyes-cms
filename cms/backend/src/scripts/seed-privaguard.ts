import { db } from '../config/database.js';
import { products } from '../models/index.js';
import { eq } from 'drizzle-orm';
import { randomUUID } from 'crypto';

/**
 * Seed PrivaGuard product data
 * Based on landing page content from /landing-page/privaguard.html
 */

async function seedPrivaGuard() {
  console.log('🌱 Seeding PrivaGuard product data...');

  const privaguardId = randomUUID();

  const privaguardProduct = {
    id: privaguardId,
    slug: 'privaguard',

    // Product names
    nameEn: 'PrivaGuard',
    nameVi: 'PrivaGuard',
    category: 'Cybersecurity',

    // Taglines
    taglineEn: 'Smart Consent Management & Personal Data Protection Platform',
    taglineVi: 'Nền tảng Quản lý Đồng thuận & Bảo vệ Dữ liệu Cá nhân',

    // Short descriptions
    shortDescEn: 'Comprehensive platform for compliance management and personal data protection',
    shortDescVi: 'Nền tảng toàn diện cho Quản lý Tuân thủ và Bảo vệ Dữ liệu Cá nhân',

    // Full descriptions
    fullDescEn: `PrivaGuard is a comprehensive compliance and personal data protection management platform, specifically designed for the Vietnamese market.

We provide an all-in-one solution that helps:
• Automate complex processes
• Monitor risks in real-time
• Provide a 360° overview of data health
• Ensure 100% compliance with Decree 13 and the 2026 Law`,

    fullDescVi: `PrivaGuard là nền tảng quản lý tuân thủ và bảo vệ dữ liệu cá nhân toàn diện, được thiết kế đặc thù cho thị trường Việt Nam.

Chúng tôi cung cấp một giải pháp "tất cả trong một", giúp:
• Tự động hóa các quy trình phức tạp
• Giám sát rủi ro theo thời gian thực
• Cung cấp bức tranh tổng thể 360° về sức khỏe dữ liệu
• Đảm bảo tuân thủ 100% với NĐ13 và Luật 2026`,

    // Features
    features: JSON.stringify([
      {
        title_en: 'Smart Management Dashboard',
        title_vi: 'Bảng điều khiển Quản trị Thông minh',
        desc_en: 'Provides a comprehensive, visual, real-time overview of the entire compliance status of the organization',
        desc_vi: 'Cung cấp một cái nhìn tổng quan, trực quan và theo thời gian thực về toàn bộ trạng thái tuân thủ của tổ chức',
        icon: '📊'
      },
      {
        title_en: 'Privacy Intelligence',
        title_vi: 'Lớp Giám sát Thông minh',
        desc_en: 'AI-powered intelligent monitoring and data flow analysis layer that provides unprecedented insights into how data flows through your organization',
        desc_vi: 'Lớp giám sát thông minh và phân tích dòng dữ liệu được hỗ trợ bởi AI, mang lại sự thấu hiểu chưa từng có về cách dữ liệu di chuyển trong tổ chức',
        icon: '🤖'
      },
      {
        title_en: 'Consent Management',
        title_vi: 'Quản lý Đồng thuận',
        desc_en: 'Fully automates the lifecycle of consent management and user request processing, ensuring compliance with 72-hour SLA',
        desc_vi: 'Tự động hóa hoàn toàn vòng đời quản lý sự đồng thuận và xử lý yêu cầu của người dùng, đảm bảo tuân thủ SLA 72 giờ',
        icon: '✅'
      },
      {
        title_en: 'Compliance Automation',
        title_vi: 'Tự động hóa Tuân thủ',
        desc_en: 'Automatically collects information from connected systems to create complex records and forms as required by law',
        desc_vi: 'Tự động thu thập thông tin từ các hệ thống được kết nối để tạo ra các hồ sơ, biểu mẫu phức tạp theo yêu cầu của pháp luật',
        icon: '⚙️'
      }
    ]),

    // Product images
    images: JSON.stringify([
      '/media/privaguard1.png',
      '/media/privaguard2.png',
      '/media/privaguard3.png',
      '/media/Privaguard4.png',
      '/media/Privaguard5.png'
    ]),

    // Pricing tiers
    pricing: JSON.stringify({
      tiers: [
        {
          name_en: 'Starter',
          name_vi: 'Gói Khởi đầu',
          subtitle_en: 'For small businesses',
          subtitle_vi: 'Cho doanh nghiệp nhỏ',
          features: [
            { en: 'Overview dashboard', vi: 'Bảng điều khiển tổng quan' },
            { en: 'Consent management', vi: 'Quản lý đồng thuận' },
            { en: 'Data subject portal', vi: 'Cổng thông tin chủ thể dữ liệu' },
            { en: 'Request processing (50 requests/month)', vi: 'Xử lý yêu cầu (50 yêu cầu/tháng)' },
            { en: 'Compliance forms (Decree 13)', vi: 'Mẫu biểu tuân thủ (NĐ13)' }
          ]
        },
        {
          name_en: 'Professional',
          name_vi: 'Gói Chuyên nghiệp',
          subtitle_en: 'Most popular',
          subtitle_vi: 'Phổ biến nhất',
          popular: true,
          features: [
            { en: 'All Starter features +', vi: 'Tất cả tính năng Starter +' },
            { en: 'IT systems catalog (10 systems)', vi: 'Quản lý danh mục hệ thống CNTT (10 hệ thống)' },
            { en: 'Data classification & inventory', vi: 'Phân loại & kiểm kê dữ liệu' },
            { en: 'Compliance monitoring & alerts', vi: 'Giám sát và cảnh báo tuân thủ' },
            { en: 'Automated compliance reports', vi: 'Báo cáo tuân thủ tự động' },
            { en: 'Request processing (500 requests/month)', vi: 'Xử lý yêu cầu (500 yêu cầu/tháng)' }
          ]
        },
        {
          name_en: 'Enterprise',
          name_vi: 'Gói Doanh nghiệp',
          subtitle_en: 'Comprehensive solution',
          subtitle_vi: 'Giải pháp toàn diện',
          features: [
            { en: 'All Professional features +', vi: 'Tất cả tính năng Professional +' },
            { en: 'Privacy Intelligence layer', vi: 'Lớp Giám sát Thông minh' },
            { en: 'AI Assistant', vi: 'Trợ lý AI' },
            { en: 'Data flow visualization', vi: 'Trực quan hóa dòng dữ liệu' },
            { en: 'Unlimited IT systems management', vi: 'Quản lý hệ thống CNTT không giới hạn' },
            { en: 'Unlimited request processing', vi: 'Xử lý yêu cầu không giới hạn' }
          ]
        }
      ]
    }),

    // CTA
    ctaTextEn: 'Register for Free Consultation',
    ctaTextVi: 'Đăng ký tư vấn miễn phí',
    ctaLink: 'https://docs.google.com/forms/d/e/1FAIpQLSc_Aw__UT1M-XA5pxkb3MUWKXWsWlNSJ2aEINhqqY8JcNCkRA/viewform',

    relatedProducts: JSON.stringify([]),

    isActive: true,
    displayOrder: 1,
  };

  try {
    // Check if PrivaGuard already exists
    const existing = await db.select().from(products).where(eq(products.slug, 'privaguard')).limit(1);

    if (existing.length > 0) {
      console.log('⚠️  PrivaGuard already exists, updating...');
      await db.update(products)
        .set({
          ...privaguardProduct,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(products.slug, 'privaguard'));
      console.log('✅ PrivaGuard product updated successfully!');
    } else {
      console.log('➕ Creating new PrivaGuard product...');
      await db.insert(products).values(privaguardProduct);
      console.log('✅ PrivaGuard product created successfully!');
    }

    console.log('\n📊 Product Details:');
    console.log(`   ID: ${privaguardId}`);
    console.log(`   Slug: privaguard`);
    console.log(`   Name (EN): ${privaguardProduct.nameEn}`);
    console.log(`   Name (VI): ${privaguardProduct.nameVi}`);
    console.log(`   Features: ${JSON.parse(privaguardProduct.features).length} features`);
    console.log(`   Images: ${JSON.parse(privaguardProduct.images).length} images`);
    console.log(`   Pricing tiers: ${JSON.parse(privaguardProduct.pricing).tiers.length} tiers`);

  } catch (error) {
    console.error('❌ Error seeding PrivaGuard:', error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  seedPrivaGuard()
    .then(() => {
      console.log('\n🎉 Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Seeding failed:', error);
      process.exit(1);
    });
}

export { seedPrivaGuard };
