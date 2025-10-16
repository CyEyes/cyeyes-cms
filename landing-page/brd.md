# TÀI LIỆU ĐẶC TẢ DỰ ÁN WEBSITE CYEYES - COMING SOON PAGE

## 1. PHÂN TÍCH THƯƠNG HIỆU & NHẬN DIỆN

### 1.1 Brand Identity Analysis

**Tên thương hiệu:** CyEyes  
**Tagline:** AI-Driven: Offensive | Defensive | Intelligence  
**Lĩnh vực:** Cybersecurity, AI-driven Security Solutions

**Màu sắc thương hiệu:**
- **Primary Navy Blue:** `#1a1f4d` - Chủ đạo, thể hiện sự chuyên nghiệp, bảo mật
- **Cyan/Teal:** `#17a2b8` - Màu nhấn, công nghệ, đổi mới
- **Light Cyan:** `#4fc3dc` - Gradient, highlight
- **Dark Background:** `#0a0e27` - Nền tối cho hiệu ứng cybersecurity
- **White/Light Gray:** `#ffffff`, `#e8e8e8` - Text, contrast

**Biểu tượng:** Hexagon với network nodes - tượng trưng cho:
- Kết nối mạng lưới
- Bảo mật đa lớp
- AI và intelligence

---

## 2. ĐẶC TẢ CHỨC NĂNG

### 2.1 Cấu trúc trang web

```
┌─────────────────────────────────────┐
│    HEADER: Logo + Language Toggle   │
├─────────────────────────────────────┤
│                                     │
│    HERO SECTION                     │
│    - Animated Logo/Icon             │
│    - "Coming Soon" Text             │
│    - Animated Description           │
│    - Countdown Timer (optional)     │
│                                     │
├─────────────────────────────────────┤
│                                     │
│    QR CODE SECTION                  │
│    - Grid layout 2x3 hoặc 3x2       │
│    - Mỗi QR có title + description  │
│    - Hover effects                  │
│                                     │
├─────────────────────────────────────┤
│    FOOTER: Copyright + Social       │
└─────────────────────────────────────┘
```

### 2.2 Nội dung QR Codes

Dựa trên 6 QR codes được cung cấp, đề xuất cấu trúc:

**QR Code 1 - Website/Landing Page**
- 🌐 Tiếng Việt: "Trang Web Chính Thức"
- 🌐 English: "Official Website"

**QR Code 2 - Product Demo/Trial**
- 🎯 Tiếng Việt: "Dùng Thử Sản Phẩm"
- 🎯 English: "Product Demo"

**QR Code 3 - Documentation**
- 📚 Tiếng Việt: "Tài Liệu Kỹ Thuật"
- 📚 English: "Technical Documentation"

**QR Code 4 - Contact/Support**
- 💬 Tiếng Việt: "Liên Hệ & Hỗ Trợ"
- 💬 English: "Contact & Support"

**QR Code 5 - Community/Social**
- 👥 Tiếng Việt: "Cộng Đồng & Mạng Xã Hội"
- 👥 English: "Community & Social Media"

**QR Code 6 - Newsletter/Updates**
- 📧 Tiếng Việt: "Đăng Ký Nhận Tin"
- 📧 English: "Subscribe for Updates"

---

## 3. THIẾT KẾ UI/UX CHI TIẾT

### 3.1 Typography

**Font Families:**
- **Primary (Headings):** 'Orbitron' hoặc 'Rajdhani' - Font công nghệ, futuristic
- **Secondary (Body):** 'Inter' hoặc 'Space Grotesk' - Clean, modern, dễ đọc
- **Accent (Numbers/Code):** 'Fira Code' hoặc 'JetBrains Mono' - Monospace cho số liệu

**Font Sizes:**
```css
--heading-xl: 4rem (64px)    /* Coming Soon */
--heading-lg: 2.5rem (40px)  /* Section titles */
--heading-md: 1.5rem (24px)  /* QR titles */
--body-lg: 1.125rem (18px)   /* Descriptions */
--body-md: 1rem (16px)       /* Normal text */
--body-sm: 0.875rem (14px)   /* Footer */
```

### 3.2 Color Palette Chi Tiết

```css
:root {
  /* Primary Colors */
  --primary-navy: #1a1f4d;
  --primary-cyan: #17a2b8;
  
  /* Gradients */
  --gradient-primary: linear-gradient(135deg, #1a1f4d 0%, #2a3f7d 100%);
  --gradient-accent: linear-gradient(135deg, #17a2b8 0%, #4fc3dc 100%);
  --gradient-cyber: linear-gradient(45deg, #0a0e27, #1a1f4d, #17a2b8);
  
  /* Background */
  --bg-dark: #0a0e27;
  --bg-card: rgba(26, 31, 77, 0.4);
  --bg-card-hover: rgba(26, 31, 77, 0.6);
  
  /* Text */
  --text-primary: #ffffff;
  --text-secondary: #b8bcc8;
  --text-accent: #4fc3dc;
  
  /* Effects */
  --glow-cyan: 0 0 20px rgba(79, 195, 220, 0.5);
  --glow-navy: 0 0 30px rgba(26, 31, 77, 0.8);
}
```

### 3.3 Layout & Spacing

**Container:**
- Max-width: 1400px
- Padding: 2rem (mobile), 4rem (desktop)

**Section Spacing:**
- Vertical: 6rem (96px) giữa các sections
- Internal: 3rem (48px) trong sections

**Grid System:**
- QR Code Grid: CSS Grid 3 columns desktop, 2 columns tablet, 1 column mobile
- Gap: 2rem (32px)

---

## 4. HIỆU ỨNG ĐỘNG & ANIMATIONS

### 4.1 Hero Animations

**1. Background Particle Effect:**
- Animated network nodes (particles kết nối nhau)
- Color: Cyan với opacity thay đổi
- Movement: Slow floating pattern

**2. Logo Animation:**
- Entrance: Fade in + Scale up từ center
- Continuous: Subtle pulse glow effect
- Hexagon: Rotate animation rất chậm (60s per rotation)

**3. "Coming Soon" Text:**
- Typing effect hoặc Glitch effect
- Gradient text animation (shimmer)
- Letter spacing animation on hover

**4. Matrix Rain Effect (Optional):**
- Background cyberpunk-style matrix code
- Color: Dark cyan
- Opacity: 0.1-0.2

### 4.2 QR Code Section Animations

**Card Hover Effects:**
```
- Transform: translateY(-10px) + scale(1.05)
- Box-shadow: Enhanced glow effect
- Border: Animated gradient border
- QR Code: Subtle rotate or pulse
- Icon: Color change + scale
```

**Stagger Animation:**
- Cards xuất hiện lần lượt khi scroll vào viewport
- Delay: 100ms giữa mỗi card

### 4.3 Interactive Elements

**Language Toggle:**
- Smooth slide animation
- Icon transition
- Color change với ease-in-out

**Scroll Indicator:**
- Animated arrow/mouse icon
- Bounce animation
- Fade out khi scroll

---

## 5. RESPONSIVE DESIGN

### 5.1 Breakpoints

```css
/* Mobile First Approach */
--mobile: 320px - 767px
--tablet: 768px - 1023px
--desktop: 1024px - 1439px
--large-desktop: 1440px+
```

### 5.2 Layout Changes

**Mobile (< 768px):**
- Single column QR grid
- Reduced font sizes (scale 0.75x)
- Simplified animations
- Hamburger menu if needed

**Tablet (768px - 1023px):**
- 2-column QR grid
- Medium font sizes (scale 0.85x)
- Moderate animations

**Desktop (1024px+):**
- 3-column QR grid
- Full font sizes
- All animations enabled

---

## 6. TECHNICAL SPECIFICATIONS

### 6.1 Tech Stack Đề Xuất

**Frontend:**
- HTML5 (Semantic markup)
- CSS3 (Grid, Flexbox, Animations)
- Vanilla JavaScript hoặc React.js
- GSAP hoặc Framer Motion (animations)

**Libraries:**
- Three.js hoặc Particles.js (background effects)
- AOS (Animate On Scroll)
- i18next (internationalization)

**Performance:**
- Lazy loading images
- CSS/JS minification
- Image optimization (WebP format)
- CDN delivery

### 6.2 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 7. CONTENT BILINGUAL

### 7.1 Main Content

| Vietnamese | English |
|------------|---------|
| Sắp Ra Mắt | Coming Soon |
| Nền tảng An ninh mạng được hỗ trợ bởi AI | AI-Driven Cybersecurity Platform |
| Giải pháp bảo mật toàn diện: Tấn công, Phòng thủ, Thu thập thông tin | Comprehensive Security Solutions: Offensive, Defensive, Intelligence |
| Quét mã QR để truy cập | Scan QR Code to Access |
| Chuyển sang tiếng Anh | Switch to English |

### 7.2 QR Section Content

Đã mô tả ở phần 2.2

