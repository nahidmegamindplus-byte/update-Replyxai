const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const nextHtmlPath = path.join(rootDir, '.next', 'server', 'app', 'index.html');
const globalCssPath = path.join(rootDir, 'global.css');
const publicIndexPath = path.join(rootDir, 'public', 'index.html');
const rootIndexPath = path.join(rootDir, 'index.html');

console.log('[HTML Generator] Generating 100% self-contained Tailwind HTML landing page...');

if (!fs.existsSync(nextHtmlPath)) {
  console.warn('[HTML Generator] .next/server/app/index.html not found, skipping.');
  process.exit(0);
}

// 1. Read pre-rendered HTML
let html = fs.readFileSync(nextHtmlPath, 'utf8');

// 2. Read full compiled Tailwind CSS (80+ KB)
let css = '';
if (fs.existsSync(globalCssPath)) {
  css = fs.readFileSync(globalCssPath, 'utf8');
}

// 3. Remove Next.js internal flight data and hydration chunks cleanly
html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');

// 4. Inject Google fonts Hind Siliguri + Inter preconnect, Tailwind CDN, and inlined Tailwind stylesheet into <head>
const styleAndScripts = `
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ReplyX AI — AI-Powered Omnichannel Social Automation</title>
  <meta name="description" content="আপনার সোশ্যাল মিডিয়ার জন্য স্মার্ট ওমনিচ্যানেল AI Sales Assistant। WhatsApp, Instagram, Facebook Messenger, X এবং Telegram—সব চ্যানেল থেকে আসা কাস্টমারের মেসেজ বুঝে তাৎক্ষণিক উত্তর ও অর্ডার ক্যাপচার।">
  <link rel="icon" href="/favicon.ico" type="image/x-icon">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style id="replyx-inlined-tailwind-css">
    ${css}
    html { scroll-behavior: smooth; }
    body { font-family: 'Hind Siliguri', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    .faq-answer { display: none; }
    .faq-answer.open { display: block !important; }
  </style>
`;

if (html.includes('<head>')) {
  html = html.replace('<head>', '<head>' + styleAndScripts);
} else {
  html = '<!DOCTYPE html><html lang="bn"><head>' + styleAndScripts + '</head>' + html;
}

// 5. Inject FAQ Answers into the FAQ cards
const faqs = [
  {
    q: 'ReplyX AI কি ফেসবুকে পেজের মেসেজের উত্তর স্বয়ংক্রিয়ভাবে পাঠাতে পারে?',
    a: 'হ্যাঁ! ফেসবুকের অফিসিয়াল মেসেঞ্জার গ্রাফ এপিআই এবং সিকিউর ওয়েবহুকের মাধ্যমে যেকোনো কাস্টমারের মেসেজে ১-৩ সেকেন্ডের মধ্যে স্বয়ংক্রিয় ও নির্ভুল উত্তর প্রদান করা হয়।'
  },
  {
    q: 'AI কি কাল্পনিক কোনো দাম বা স্টক তথ্য বানিয়ে বলবে?',
    a: 'কখনোই না! ReplyX AI-তে রয়েছে কঠোর প্রম্পট গার্ড এবং ইনভেন্টরি ভেরিফিকেশন ইঞ্জিন। আপনার প্রোডাক্ট লিস্টে উল্লেখিত সঠিক দাম ও স্টক ছাড়া এটি অন্য কোনো মনগড়া তথ্য দেয় না।'
  },
  {
    q: 'গ্রাহক ব্যাংলিশে (Banglish) লিখলে AI বুঝতে পারে?',
    a: 'জি, শতভাগ! আমাদের এআই মডেলগুলো বাংলাদেশি ব্যবহারকারীদের স্বাভাবিক ভাষা, যেমন: "vai delivery charge koto?" বা "Dhakar baire kobe pabo?" খুব সহজে বোঝে।'
  },
  {
    q: 'কোন কোন AI প্রোভাইডার ব্যবহার করা যায়?',
    a: 'আপনি Google Gemini (1.5 Flash / Pro) এবং OpenAI (GPT-4o / GPT-4o-mini) উভয় প্রোভাইডার নির্বাচন করতে পারবেন।'
  },
  {
    q: 'আমরা কি নিজে নিজে সার্ভারে এটি হোস্ট করতে পারবো?',
    a: 'হ্যাঁ, ReplyX AI সম্পূর্ণ সেলফ-হোস্টেবল এবং প্রোডাকশন-রেডি। আপনি ভিপিএস, ক্লাউড রান বা যেকোনো প্ল্যাটফর্মে খুব সহজে ডাটাবেজ সহ চালাতে পারবেন।'
  }
];

faqs.forEach((item, idx) => {
  const needle = `<span>${item.q}</span>`;
  const answerMarkup = `
    <div id="faq-ans-${idx}" class="faq-answer px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
      ${item.a}
    </div>
  `;
  const qPos = html.indexOf(needle);
  if (qPos !== -1) {
    const btnEnd = html.indexOf('</button>', qPos);
    if (btnEnd !== -1) {
      html = html.slice(0, btnEnd + 9) + answerMarkup + html.slice(btnEnd + 9);
    }
  }
});

// 6. Interactive Scripts (FAQ accordion toggle + smooth scroll)
const clientScripts = `
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      var faqButtons = document.querySelectorAll('#faq button');
      faqButtons.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
          e.preventDefault();
          var parent = btn.parentElement;
          var ans = parent.querySelector('.faq-answer');
          var svg = btn.querySelector('svg');
          if (!ans) return;
          var isOpen = ans.classList.contains('open');

          // Close all FAQ items
          document.querySelectorAll('#faq .faq-answer').forEach(function(el) {
            el.classList.remove('open');
          });
          document.querySelectorAll('#faq svg').forEach(function(s) {
            s.style.transform = 'rotate(0deg)';
          });

          // Toggle current
          if (!isOpen) {
            ans.classList.add('open');
            if (svg) svg.style.transform = 'rotate(180deg)';
          }
        });
      });
    });
  </script>
`;

if (html.includes('</body>')) {
  html = html.replace('</body>', clientScripts + '</body>');
} else {
  html += clientScripts;
}

// 7. Write to public/index.html and root index.html
fs.writeFileSync(publicIndexPath, html, 'utf8');
fs.writeFileSync(rootIndexPath, html, 'utf8');

console.log(`[HTML Generator] Successfully created public/index.html & root index.html (${Math.round(html.length / 1024)} KB).`);
console.log('[HTML Generator] All Tailwind CSS classes & SVGs 100% inlined!');
