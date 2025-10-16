import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../config/database.js';
import { users, blogPosts, teamMembers, customers, products } from '../models/index.js';
import { logger } from '../services/logger.service.js';

dotenv.config();

/**
 * Seed sample content (blogs, team, customers, products)
 */
const seedContent = async (): Promise<void> => {
  try {
    logger.info('🌱 Starting content seeding...');

    // Get admin user ID
    const admin = await db
      .select()
      .from(users)
      .where((user) => user.role === 'admin')
      .get();

    if (!admin) {
      throw new Error('Admin user not found. Please run db:seed first.');
    }

    const adminId = admin.id;
    const authorName = admin.fullName;

    // ============================================
    // 1. SEED BLOG POSTS
    // ============================================
    logger.info('📝 Seeding blog posts...');

    const sampleBlogs = [
      {
        id: uuidv4(),
        slug: 'introduction-to-cyeyes',
        titleEn: 'Introduction to CyEyes - AI-Driven Cybersecurity',
        titleVi: 'Giới thiệu CyEyes - An ninh mạng được hỗ trợ bởi AI',
        excerptEn:
          'Discover how CyEyes leverages artificial intelligence to provide comprehensive cybersecurity solutions for modern enterprises.',
        excerptVi:
          'Khám phá cách CyEyes tận dụng trí tuệ nhân tạo để cung cấp giải pháp an ninh mạng toàn diện cho doanh nghiệp hiện đại.',
        contentEn: `<h2>Welcome to CyEyes</h2>
<p>CyEyes is a cutting-edge cybersecurity platform that combines artificial intelligence with expert human analysis to protect your organization from evolving threats.</p>
<h3>Our Approach</h3>
<ul>
<li><strong>Offensive Security:</strong> Proactive vulnerability assessment and penetration testing</li>
<li><strong>Defensive Security:</strong> Real-time threat detection and incident response</li>
<li><strong>Threat Intelligence:</strong> Advanced analytics and predictive threat modeling</li>
</ul>
<p>Our AI-powered platform continuously learns from global threat patterns to provide you with the most up-to-date protection against cyber threats.</p>`,
        contentVi: `<h2>Chào mừng đến với CyEyes</h2>
<p>CyEyes là nền tảng an ninh mạng tiên tiến kết hợp trí tuệ nhân tạo với phân tích chuyên môn để bảo vệ tổ chức của bạn khỏi các mối đe dọa đang phát triển.</p>
<h3>Phương pháp của chúng tôi</h3>
<ul>
<li><strong>An ninh Tấn công:</strong> Đánh giá lỗ hổng chủ động và kiểm tra xâm nhập</li>
<li><strong>An ninh Phòng thủ:</strong> Phát hiện mối đe dọa thời gian thực và ứng phó sự cố</li>
<li><strong>Tình báo Mối đe dọa:</strong> Phân tích nâng cao và mô hình hóa mối đe dọa dự đoán</li>
</ul>
<p>Nền tảng được hỗ trợ bởi AI của chúng tôi liên tục học hỏi từ các mẫu mối đe dọa toàn cầu để cung cấp cho bạn sự bảo vệ cập nhật nhất chống lại các mối đe dọa mạng.</p>`,
        featuredImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
        authorId: adminId,
        authorName,
        status: 'published',
        tags: JSON.stringify(['cybersecurity', 'ai', 'introduction']),
        seoTitleEn: 'CyEyes - AI-Driven Cybersecurity Platform',
        seoTitleVi: 'CyEyes - Nền tảng An ninh mạng AI',
        seoDescriptionEn: 'Comprehensive cybersecurity solutions powered by artificial intelligence',
        seoDescriptionVi: 'Giải pháp an ninh mạng toàn diện được hỗ trợ bởi trí tuệ nhân tạo',
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        slug: 'owasp-top-10-security-risks',
        titleEn: 'Understanding OWASP Top 10 Security Risks',
        titleVi: 'Hiểu về 10 Rủi ro Bảo mật Hàng đầu OWASP',
        excerptEn:
          'A comprehensive guide to the most critical web application security risks identified by OWASP.',
        excerptVi:
          'Hướng dẫn toàn diện về các rủi ro bảo mật ứng dụng web quan trọng nhất được OWASP xác định.',
        contentEn: `<h2>OWASP Top 10: Essential Knowledge for Developers</h2>
<p>The OWASP Top 10 is a standard awareness document representing the most critical security risks to web applications.</p>
<h3>The Top 10 Risks:</h3>
<ol>
<li><strong>Broken Access Control</strong> - Unauthorized access to resources</li>
<li><strong>Cryptographic Failures</strong> - Weak encryption and data exposure</li>
<li><strong>Injection</strong> - SQL, NoSQL, and command injection attacks</li>
<li><strong>Insecure Design</strong> - Fundamental security flaws in architecture</li>
<li><strong>Security Misconfiguration</strong> - Improper security settings</li>
</ol>
<p>Understanding these risks is the first step in building secure applications. CyEyes can help you identify and mitigate these vulnerabilities.</p>`,
        contentVi: `<h2>OWASP Top 10: Kiến thức Cần thiết cho Nhà phát triển</h2>
<p>OWASP Top 10 là tài liệu nhận thức tiêu chuẩn đại diện cho các rủi ro bảo mật quan trọng nhất đối với ứng dụng web.</p>
<h3>10 Rủi ro Hàng đầu:</h3>
<ol>
<li><strong>Kiểm soát Truy cập Bị phá vỡ</strong> - Truy cập trái phép vào tài nguyên</li>
<li><strong>Lỗi Mật mã</strong> - Mã hóa yếu và tiết lộ dữ liệu</li>
<li><strong>Tiêm nhiễm</strong> - Tấn công tiêm SQL, NoSQL và lệnh</li>
<li><strong>Thiết kế Không an toàn</strong> - Lỗ hổng bảo mật cơ bản trong kiến trúc</li>
<li><strong>Cấu hình Sai Bảo mật</strong> - Cài đặt bảo mật không đúng</li>
</ol>
<p>Hiểu những rủi ro này là bước đầu tiên trong việc xây dựng ứng dụng an toàn. CyEyes có thể giúp bạn xác định và giảm thiểu các lỗ hổng này.</p>`,
        featuredImage: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de',
        authorId: adminId,
        authorName,
        status: 'published',
        tags: JSON.stringify(['owasp', 'security', 'vulnerabilities', 'web-security']),
        seoTitleEn: 'OWASP Top 10 Security Risks Explained',
        seoTitleVi: 'Giải thích 10 Rủi ro Bảo mật Hàng đầu OWASP',
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        slug: 'draft-upcoming-features',
        titleEn: 'Coming Soon: New CyEyes Features',
        titleVi: 'Sắp ra mắt: Tính năng Mới của CyEyes',
        excerptEn: 'Sneak peek at exciting new features coming to the CyEyes platform.',
        excerptVi: 'Xem trước các tính năng mới thú vị sắp ra mắt trên nền tảng CyEyes.',
        contentEn: '<p>Stay tuned for exciting announcements!</p>',
        contentVi: '<p>Hãy theo dõi để nhận thông báo thú vị!</p>',
        authorId: adminId,
        authorName,
        status: 'draft',
        tags: JSON.stringify(['roadmap', 'features']),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    for (const blog of sampleBlogs) {
      const existing = await db
        .select()
        .from(blogPosts)
        .where((b) => b.slug === blog.slug)
        .get();

      if (!existing) {
        await db.insert(blogPosts).values(blog);
        logger.info(`✅ Created blog: ${blog.slug}`);
      }
    }

    // ============================================
    // 2. SEED TEAM MEMBERS
    // ============================================
    logger.info('👥 Seeding team members...');

    const sampleTeam = [
      {
        id: uuidv4(),
        nameEn: 'Dr. Sarah Chen',
        nameVi: 'Tiến sĩ Sarah Chen',
        position: 'Chief Security Officer',
        bioEn:
          'Over 15 years of experience in cybersecurity, leading offensive and defensive security operations for Fortune 500 companies. PhD in Computer Security from MIT.',
        bioVi:
          'Hơn 15 năm kinh nghiệm trong an ninh mạng, lãnh đạo các hoạt động bảo mật tấn công và phòng thủ cho các công ty Fortune 500. Tiến sĩ An ninh Máy tính từ MIT.',
        avatar: 'https://i.pravatar.cc/300?img=47',
        email: 'sarah.chen@cyeyes.com',
        linkedin: 'https://linkedin.com/in/sarahchen',
        isActive: true,
        displayOrder: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        nameEn: 'Michael Rodriguez',
        nameVi: 'Michael Rodriguez',
        position: 'AI Research Director',
        bioEn:
          'Leading our AI research team in developing next-generation threat detection algorithms. Former machine learning engineer at Google Security.',
        bioVi:
          'Lãnh đạo đội ngũ nghiên cứu AI trong việc phát triển thuật toán phát hiện mối đe dọa thế hệ tiếp theo. Cựu kỹ sư học máy tại Google Security.',
        avatar: 'https://i.pravatar.cc/300?img=33',
        email: 'michael.r@cyeyes.com',
        linkedin: 'https://linkedin.com/in/michaelrodriguez',
        twitter: 'https://twitter.com/mrodriguez',
        isActive: true,
        displayOrder: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        nameEn: 'Emily Nguyen',
        nameVi: 'Nguyễn Thu Phương (Emily)',
        position: 'Penetration Testing Lead',
        bioEn:
          'OSCP and OSWE certified ethical hacker specializing in web application security. Led security assessments for major financial institutions.',
        bioVi:
          'Hacker có đạo đức được chứng nhận OSCP và OSWE, chuyên về bảo mật ứng dụng web. Lãnh đạo đánh giá bảo mật cho các tổ chức tài chính lớn.',
        avatar: 'https://i.pravatar.cc/300?img=44',
        email: 'emily.nguyen@cyeyes.com',
        linkedin: 'https://linkedin.com/in/emilynguyen',
        isActive: true,
        displayOrder: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    for (const member of sampleTeam) {
      const existing = await db
        .select()
        .from(teamMembers)
        .where((t) => t.email === member.email)
        .get();

      if (!existing) {
        await db.insert(teamMembers).values(member);
        logger.info(`✅ Created team member: ${member.nameEn}`);
      }
    }

    // ============================================
    // 3. SEED CUSTOMERS
    // ============================================
    logger.info('🏢 Seeding customers...');

    const sampleCustomers = [
      {
        id: uuidv4(),
        nameEn: 'TechCorp Global',
        nameVi: 'TechCorp Toàn cầu',
        logo: 'https://via.placeholder.com/200x80/1a1f4d/ffffff?text=TechCorp',
        website: 'https://techcorp.example.com',
        industry: 'Technology',
        testimonialEn:
          'CyEyes helped us identify and fix critical vulnerabilities before they could be exploited. Their AI-driven approach is truly a game-changer in cybersecurity.',
        testimonialVi:
          'CyEyes đã giúp chúng tôi xác định và khắc phục các lỗ hổng nghiêm trọng trước khi chúng có thể bị khai thác. Phương pháp tiếp cận dựa trên AI của họ thực sự thay đổi cuộc chơi trong an ninh mạng.',
        contactPerson: 'Jane Doe',
        contactEmail: 'jane.doe@techcorp.example.com',
        isFeatured: true,
        displayOrder: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        nameEn: 'SecureBank International',
        nameVi: 'Ngân hàng SecureBank Quốc tế',
        logo: 'https://via.placeholder.com/200x80/17a2b8/ffffff?text=SecureBank',
        website: 'https://securebank.example.com',
        industry: 'Finance',
        testimonialEn:
          'Outstanding security services. CyEyes team is professional, responsive, and their expertise helped us achieve compliance with international security standards.',
        testimonialVi:
          'Dịch vụ bảo mật xuất sắc. Đội ngũ CyEyes chuyên nghiệp, phản hồi nhanh và chuyên môn của họ giúp chúng tôi đạt được tuân thủ các tiêu chuẩn bảo mật quốc tế.',
        contactPerson: 'Robert Lee',
        isFeatured: true,
        displayOrder: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        nameEn: 'HealthCare Plus',
        nameVi: 'HealthCare Plus',
        logo: 'https://via.placeholder.com/200x80/4fc3dc/ffffff?text=HealthCare',
        website: 'https://healthcareplus.example.com',
        industry: 'Healthcare',
        isFeatured: false,
        displayOrder: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    for (const customer of sampleCustomers) {
      const existing = await db
        .select()
        .from(customers)
        .where((c) => c.nameEn === customer.nameEn)
        .get();

      if (!existing) {
        await db.insert(customers).values(customer);
        logger.info(`✅ Created customer: ${customer.nameEn}`);
      }
    }

    // ============================================
    // 4. SEED PRODUCTS
    // ============================================
    logger.info('📦 Seeding products...');

    const sampleProducts = [
      {
        id: uuidv4(),
        slug: 'penetration-testing',
        nameEn: 'Penetration Testing Service',
        nameVi: 'Dịch vụ Kiểm tra Xâm nhập',
        descriptionEn:
          'Comprehensive security assessment to identify vulnerabilities in your systems before attackers do.',
        descriptionVi:
          'Đánh giá bảo mật toàn diện để xác định lỗ hổng trong hệ thống của bạn trước khi kẻ tấn công làm.',
        featuresEn: JSON.stringify([
          'Network penetration testing',
          'Web application security testing',
          'Social engineering assessments',
          'Detailed vulnerability reports',
          'Remediation guidance and support',
        ]),
        featuresVi: JSON.stringify([
          'Kiểm tra xâm nhập mạng',
          'Kiểm tra bảo mật ứng dụng web',
          'Đánh giá kỹ thuật xã hội',
          'Báo cáo lỗ hổng chi tiết',
          'Hướng dẫn và hỗ trợ khắc phục',
        ]),
        category: 'Offensive Security',
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
        pricing: JSON.stringify({ type: 'contact' }),
        isActive: true,
        isFeatured: true,
        displayOrder: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        slug: 'ai-threat-monitoring',
        nameEn: 'AI Threat Monitoring',
        nameVi: 'Giám sát Mối đe dọa AI',
        descriptionEn:
          '24/7 AI-powered threat detection and response system to protect your infrastructure in real-time.',
        descriptionVi:
          'Hệ thống phát hiện và ứng phó mối đe dọa được hỗ trợ bởi AI 24/7 để bảo vệ cơ sở hạ tầng của bạn theo thời gian thực.',
        featuresEn: JSON.stringify([
          'Real-time threat detection',
          'Automated incident response',
          'AI-powered analytics dashboard',
          'Custom alerting rules',
          'Integration with existing SIEM tools',
        ]),
        featuresVi: JSON.stringify([
          'Phát hiện mối đe dọa thời gian thực',
          'Ứng phó sự cố tự động',
          'Bảng điều khiển phân tích AI',
          'Quy tắc cảnh báo tùy chỉnh',
          'Tích hợp với công cụ SIEM hiện có',
        ]),
        category: 'Defensive Security',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31',
        pricing: JSON.stringify({
          type: 'subscription',
          amount: 999,
          currency: 'USD',
          interval: 'monthly',
        }),
        isActive: true,
        isFeatured: true,
        displayOrder: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: uuidv4(),
        slug: 'security-training',
        nameEn: 'Security Awareness Training',
        nameVi: 'Đào tạo Nhận thức Bảo mật',
        descriptionEn:
          'Comprehensive training programs to educate your team on cybersecurity best practices and threat awareness.',
        descriptionVi:
          'Chương trình đào tạo toàn diện để giáo dục đội ngũ của bạn về các phương pháp tốt nhất và nhận thức mối đe dọa an ninh mạng.',
        featuresEn: JSON.stringify([
          'Interactive online modules',
          'Phishing simulation exercises',
          'Custom training content',
          'Progress tracking and reporting',
          'Certification upon completion',
        ]),
        featuresVi: JSON.stringify([
          'Mô-đun trực tuyến tương tác',
          'Bài tập mô phỏng lừa đảo',
          'Nội dung đào tạo tùy chỉnh',
          'Theo dõi tiến độ và báo cáo',
          'Chứng chỉ sau khi hoàn thành',
        ]),
        category: 'Training',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
        pricing: JSON.stringify({
          type: 'paid',
          amount: 499,
          currency: 'USD',
        }),
        isActive: true,
        isFeatured: false,
        displayOrder: 2,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    for (const product of sampleProducts) {
      const existing = await db
        .select()
        .from(products)
        .where((p) => p.slug === product.slug)
        .get();

      if (!existing) {
        await db.insert(products).values(product);
        logger.info(`✅ Created product: ${product.slug}`);
      }
    }

    logger.info('✨ Content seeding completed successfully!');
    logger.info(`📊 Summary:`);
    logger.info(`  - ${sampleBlogs.length} blog posts`);
    logger.info(`  - ${sampleTeam.length} team members`);
    logger.info(`  - ${sampleCustomers.length} customers`);
    logger.info(`  - ${sampleProducts.length} products`);
  } catch (error) {
    logger.error('❌ Content seeding failed:', error);
    throw error;
  }
};

// Run seed if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedContent()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

export { seedContent };
