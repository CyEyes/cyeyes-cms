# CyEyes - Coming Soon Page

Website trang giới thiệu "Sắp Ra Mắt" cho nền tảng An ninh mạng CyEyes với slogan "AI-Driven: Offensive | Defensive | Intelligence".

## 🎨 Tính năng

- ✅ **Thiết kế hiện đại** với Glass Morphism & Light Theme
- ✅ **Enterprise-grade UI** - Professional, clean, đậm chất doanh nghiệp
- ✅ **Glass Morphism Effects** - Backdrop blur, transparency, shadows
- ✅ **Hiệu ứng động** nền tảng với particle network
- ✅ **Đa ngôn ngữ** (Tiếng Việt / English)
- ✅ **6 QR Codes** với các liên kết khác nhau
- ✅ **Responsive Design** (Mobile, Tablet, Desktop)
- ✅ **Animations mượt mà** với CSS & JavaScript
- ✅ **Performance tối ưu** cho mọi thiết bị
- ✅ **Fixed Header** với glass effect khi scroll

## 🚀 Cài đặt & Chạy

### Phương pháp 1: Mở trực tiếp

1. Clone hoặc tải repository về máy:
```bash
git clone <repository-url>
cd webce
```

2. Mở file `index.html` trong trình duyệt web:
```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html
```

### Phương pháp 2: Sử dụng Local Server (Khuyến nghị)

**Sử dụng Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Sử dụng Node.js (http-server):**
```bash
# Cài đặt http-server globally
npm install -g http-server

# Chạy server
http-server -p 8000
```

**Sử dụng PHP:**
```bash
php -S localhost:8000
```

Sau đó truy cập: `http://localhost:8000`

### Phương pháp 3: Live Server (VS Code)

1. Cài đặt extension "Live Server" trong VS Code
2. Click chuột phải vào `index.html`
3. Chọn "Open with Live Server"

## 📁 Cấu trúc thư mục

```
webce/
├── index.html          # Trang HTML chính
├── styles.css          # CSS styling với animations
├── script.js           # JavaScript cho tương tác & language switching
├── particles.js        # Particle network animation
├── brd.md             # Business Requirements Document (Vietnamese)
├── CLAUDE.md          # Hướng dẫn cho Claude Code
└── README.md          # File này
```

## 🎯 Cấu trúc trang

### Header
- Logo CyEyes với hexagon animated
- Nút chuyển đổi ngôn ngữ (VI/EN)

### Hero Section
- Logo hexagon với network nodes animation
- Tiêu đề "COMING SOON" / "SẮP RA MẮT" với glitch effect
- Tagline: "Offensive | Defensive | Intelligence"
- Scroll indicator

### QR Code Section
6 thẻ QR code với các liên kết:
1. 🌐 **Trang Web Chính Thức** - Official Website
2. 🎯 **Dùng Thử Sản Phẩm** - Product Demo
3. 📚 **Tài Liệu Kỹ Thuật** - Technical Documentation
4. 💬 **Liên Hệ & Hỗ Trợ** - Contact & Support
5. 👥 **Cộng Đồng & Mạng Xã Hội** - Community & Social Media
6. 📧 **Đăng Ký Nhận Tin** - Subscribe for Updates

### Footer
- Copyright information (© 2025 CyEyes)
- Social media link: Facebook

## 🎨 Màu sắc thương hiệu (Light Theme)

```css
Primary Navy Blue: #1a1f4d
Primary Cyan: #17a2b8
Light Cyan: #4fc3dc
Accent Blue: #2196F3
Accent Teal: #00BCD4

Background: #f8f9fa, gradient light colors
Glass Morphism: rgba(255, 255, 255, 0.7)
Text Primary: #1a1f4d
Text Secondary: #546e7a
```

## 🔧 Tùy chỉnh

### Thay đổi QR Codes

Trong file `index.html`, tìm các thẻ `<img>` trong `.qr-code`:

```html
<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=YOUR_URL_HERE" alt="QR Code">
```

Thay `YOUR_URL_HERE` bằng URL thực tế của bạn.

### Thay đổi hiệu ứng nền

Trong file `particles.js`, bạn có thể chọn 1 trong 3 hiệu ứng:

```javascript
// Option 1: Particle Network (mặc định)
new ParticleNetwork();

// Option 2: Matrix Rain Effect
// new MatrixRain();

// Option 3: Hexagon Grid
// new HexagonGrid();
```

### Thay đổi font chữ

Fonts hiện tại sử dụng Google Fonts. Để thay đổi, cập nhật trong `<head>` của `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=YOUR_FONT_HERE&display=swap" rel="stylesheet">
```

Và cập nhật trong `styles.css`:

```css
:root {
  --font-heading: 'YourFont', sans-serif;
  --font-body: 'YourFont', sans-serif;
}
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (1 column grid)
- **Tablet**: 768px - 1023px (2 column grid)
- **Desktop**: 1024px+ (3 column grid)

## ⚡ Tối ưu hóa

### Hiệu suất
- Lazy loading cho hình ảnh
- Debounced scroll events
- Reduced animations trên mobile
- Canvas animations pause khi tab không active

### SEO
- Semantic HTML5
- Meta tags cho description & keywords
- Alt text cho tất cả hình ảnh
- Proper heading hierarchy

## 🎮 Easter Eggs

Nhập **Konami Code** trên bàn phím: `↑ ↑ ↓ ↓ ← → ← → B A`

Để kích hoạt hiệu ứng đặc biệt!

## 🌐 Trình duyệt hỗ trợ

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Ghi chú kỹ thuật

### CSS Features
- CSS Grid & Flexbox
- CSS Variables (Custom Properties)
- CSS Animations & Transitions
- Backdrop Filter
- Gradient Text

### JavaScript Features
- Canvas API
- Intersection Observer
- ES6+ Syntax
- Event Delegation
- Debouncing

## 🔨 Development

### Modifications
Để chỉnh sửa website:

1. **HTML**: Chỉnh sửa nội dung trong `index.html`
2. **Styling**: Chỉnh sửa CSS trong `styles.css`
3. **Interactions**: Chỉnh sửa JavaScript trong `script.js`
4. **Background Effects**: Chỉnh sửa `particles.js`

### Testing
Test trên nhiều thiết bị:
- Desktop browsers
- Mobile devices (iOS & Android)
- Tablet devices
- Different screen sizes

## 📄 License

© 2024 CyEyes. All rights reserved.

## 🤝 Contributing

Để đóng góp vào dự án:
1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📞 Support

Để được hỗ trợ hoặc báo lỗi, vui lòng liên hệ qua các kênh:
- Website: https://cyeyes.com
- Email: support@cyeyes.com

---

**Phát triển bởi CyEyes Team**
*AI-Driven: Offensive | Defensive | Intelligence*
