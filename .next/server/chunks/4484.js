"use strict";exports.id=4484,exports.ids=[4484],exports.modules={84517:(e,a,t)=>{t.d(a,{S:()=>l});var T=t(9487),E=t(11671),s=t.n(E),n=t(21431);let i=!1,o=null;async function l(){if(!i)return o||(o=(async()=>{try{try{await T.default.$queryRawUnsafe("PRAGMA journal_mode = WAL;")}catch(e){}try{await T.default.$queryRawUnsafe("PRAGMA busy_timeout = 30000;")}catch(e){}try{await T.default.$queryRawUnsafe("PRAGMA synchronous = NORMAL;")}catch(e){}try{await T.default.$queryRawUnsafe("PRAGMA cache_size = -20000;")}catch(e){}try{await T.default.$queryRawUnsafe("PRAGMA temp_store = MEMORY;")}catch(e){}try{await T.default.$queryRawUnsafe("PRAGMA mmap_size = 268435456;")}catch(e){}await T.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "fullName" TEXT NOT NULL,
        "businessName" TEXT NOT NULL,
        "facebookPageUrl" TEXT,
        "email" TEXT NOT NULL UNIQUE,
        "passwordHash" TEXT NOT NULL,
        "phone" TEXT,
        "avatarUrl" TEXT,
        "role" TEXT NOT NULL DEFAULT 'USER',
        "status" TEXT NOT NULL DEFAULT 'ACTIVE',
        "plan" TEXT NOT NULL DEFAULT 'STARTER',
        "planStatus" TEXT NOT NULL DEFAULT 'INACTIVE',
        "monthlyMessageLimit" INTEGER NOT NULL DEFAULT 500,
        "messagesSentThisMonth" INTEGER NOT NULL DEFAULT 0,
        "planExpiresAt" DATETIME,
        "activePackageId" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `),await T.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "AiSetting" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "provider" TEXT NOT NULL DEFAULT 'GEMINI',
        "model" TEXT NOT NULL DEFAULT 'gemini-1.5-flash',
        "encryptedApiKey" TEXT,
        "temperature" REAL NOT NULL DEFAULT 0.7,
        "maxTokens" INTEGER NOT NULL DEFAULT 800,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("userId", "provider")
      );
    `),await T.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "ActivityLog" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "pageId" TEXT,
        "action" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "metadata" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `),await T.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Package" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "slug" TEXT NOT NULL UNIQUE,
        "description" TEXT,
        "price" REAL NOT NULL DEFAULT 0,
        "durationDays" INTEGER NOT NULL DEFAULT 30,
        "messageLimit" INTEGER NOT NULL DEFAULT 1000,
        "pageLimit" INTEGER NOT NULL DEFAULT 1,
        "productLimit" INTEGER NOT NULL DEFAULT 50,
        "features" TEXT NOT NULL DEFAULT '[]',
        "isPopular" BOOLEAN NOT NULL DEFAULT 0,
        "isActive" BOOLEAN NOT NULL DEFAULT 1,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `),await T.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "PaymentMethod" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL UNIQUE,
        "displayName" TEXT NOT NULL,
        "accountType" TEXT NOT NULL DEFAULT 'PERSONAL',
        "accountNumber" TEXT NOT NULL,
        "instructions" TEXT,
        "qrCodeUrl" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT 1,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `),await T.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "PackageOrder" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "orderNumber" TEXT NOT NULL UNIQUE,
        "userId" TEXT NOT NULL,
        "packageId" TEXT NOT NULL,
        "paymentMethodId" TEXT,
        "paymentMethodName" TEXT NOT NULL,
        "amount" REAL NOT NULL,
        "senderNumber" TEXT NOT NULL,
        "transactionId" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "adminNote" TEXT,
        "paymentProofUrl" TEXT,
        "approvedAt" DATETIME,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `),await T.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Page" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "channel" TEXT NOT NULL DEFAULT 'FACEBOOK',
        "channelIdentifier" TEXT,
        "extraConfig" TEXT,
        "facebookPageId" TEXT NOT NULL,
        "pageName" TEXT NOT NULL,
        "pageUsername" TEXT,
        "pageProfileImage" TEXT,
        "pageAccessTokenEncrypted" TEXT NOT NULL,
        "verifyTokenEncrypted" TEXT NOT NULL,
        "webhookUrl" TEXT,
        "webhookStatus" TEXT NOT NULL DEFAULT 'PENDING',
        "connectionStatus" TEXT NOT NULL DEFAULT 'CONNECTED',
        "autoReplyEnabled" BOOLEAN NOT NULL DEFAULT 1,
        "humanHandoffEnabled" BOOLEAN NOT NULL DEFAULT 1,
        "replyLanguage" TEXT NOT NULL DEFAULT 'AUTO',
        "replyStyle" TEXT NOT NULL DEFAULT 'FRIENDLY',
        "aiInstructions" TEXT,
        "productImageReply" BOOLEAN NOT NULL DEFAULT 1,
        "maxImagesPerConversation" INTEGER NOT NULL DEFAULT 2,
        "orderDetection" BOOLEAN NOT NULL DEFAULT 1,
        "voiceProcessing" BOOLEAN NOT NULL DEFAULT 1,
        "imageUnderstanding" BOOLEAN NOT NULL DEFAULT 1,
        "replyDelaySeconds" INTEGER NOT NULL DEFAULT 3,
        "followUpEnabled" BOOLEAN NOT NULL DEFAULT 0,
        "followUpWaitMinutes" INTEGER NOT NULL DEFAULT 30,
        "followUpMessage" TEXT,
        "followUpOnlySeen" BOOLEAN NOT NULL DEFAULT 1,
        "followUpMaxCount" INTEGER NOT NULL DEFAULT 1,
        "followUpFrequency" TEXT NOT NULL DEFAULT 'ONCE',
        "followUpIntervalHours" INTEGER NOT NULL DEFAULT 24,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("userId", "facebookPageId")
      );
    `),await T.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Product" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "pageId" TEXT,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "sku" TEXT,
        "category" TEXT,
        "price" REAL NOT NULL,
        "discountPrice" REAL,
        "stockQuantity" INTEGER NOT NULL DEFAULT 0,
        "stockStatus" TEXT NOT NULL DEFAULT 'IN_STOCK',
        "imageUrl" TEXT,
        "deliveryInfo" TEXT,
        "productAiInstructions" TEXT,
        "isActive" BOOLEAN NOT NULL DEFAULT 1,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `),await T.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Conversation" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "pageId" TEXT NOT NULL,
        "channel" TEXT NOT NULL DEFAULT 'FACEBOOK',
        "senderPsid" TEXT NOT NULL,
        "customerName" TEXT,
        "lastMessage" TEXT,
        "lastMessageAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "status" TEXT NOT NULL DEFAULT 'ACTIVE',
        "aiEnabled" BOOLEAN NOT NULL DEFAULT 1,
        "unreadCount" INTEGER NOT NULL DEFAULT 0,
        "imagesSentCount" INTEGER NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE("pageId", "senderPsid")
      );
    `),await T.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Message" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "conversationId" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "pageId" TEXT NOT NULL,
        "senderPsid" TEXT NOT NULL,
        "direction" TEXT NOT NULL,
        "messageType" TEXT NOT NULL DEFAULT 'TEXT',
        "messageText" TEXT,
        "mediaUrl" TEXT,
        "transcription" TEXT,
        "aiGenerated" BOOLEAN NOT NULL DEFAULT 0,
        "aiModel" TEXT,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `),await T.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Order" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "pageId" TEXT NOT NULL,
        "conversationId" TEXT,
        "customerName" TEXT NOT NULL,
        "phone" TEXT NOT NULL,
        "address" TEXT NOT NULL,
        "product" TEXT NOT NULL,
        "productId" TEXT,
        "quantity" INTEGER NOT NULL DEFAULT 1,
        "price" REAL NOT NULL DEFAULT 0,
        "totalPrice" REAL NOT NULL DEFAULT 0,
        "notes" TEXT,
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "source" TEXT NOT NULL DEFAULT 'MESSENGER_AI',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `),await T.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "SystemSetting" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "key" TEXT NOT NULL UNIQUE,
        "value" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `),await T.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "LicenseKey" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "key" TEXT NOT NULL UNIQUE,
        "plan" TEXT NOT NULL DEFAULT 'STARTER',
        "packageId" TEXT,
        "durationDays" INTEGER NOT NULL DEFAULT 30,
        "messageLimit" INTEGER NOT NULL DEFAULT 1000,
        "pageLimit" INTEGER NOT NULL DEFAULT 1,
        "productLimit" INTEGER NOT NULL DEFAULT 50,
        "clientName" TEXT,
        "clientPhone" TEXT,
        "clientNote" TEXT,
        "status" TEXT NOT NULL DEFAULT 'ACTIVE',
        "usedByUserId" TEXT,
        "usedAt" DATETIME,
        "expiresAt" DATETIME,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `),await T.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "FollowUpScheduleStep" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT,
        "pageId" TEXT,
        "stepNumber" INTEGER NOT NULL DEFAULT 1,
        "dayOffset" INTEGER NOT NULL DEFAULT 1,
        "timeOfDay" TEXT NOT NULL DEFAULT '10:00',
        "title" TEXT NOT NULL,
        "guidelinePrompt" TEXT,
        "isEnabled" BOOLEAN NOT NULL DEFAULT 1,
        "isGlobalDefault" BOOLEAN NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `),await T.default.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "FollowUpLog" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "userId" TEXT NOT NULL,
        "pageId" TEXT NOT NULL,
        "conversationId" TEXT NOT NULL,
        "stepNumber" INTEGER NOT NULL DEFAULT 1,
        "dayOffset" INTEGER NOT NULL DEFAULT 1,
        "scheduledTime" TEXT,
        "messageText" TEXT NOT NULL,
        "channel" TEXT NOT NULL DEFAULT 'FACEBOOK',
        "customerName" TEXT,
        "senderPsid" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'SENT',
        "aiModel" TEXT,
        "responseReceivedAt" DATETIME,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);try{await T.default.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "idx_conversation_user" ON "Conversation"("userId");'),await T.default.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "idx_conversation_page" ON "Conversation"("pageId");'),await T.default.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "idx_conversation_status" ON "Conversation"("followUpStatus");'),await T.default.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "idx_conversation_due" ON "Conversation"("nextFollowUpDueAt");'),await T.default.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "idx_conversation_user_status" ON "Conversation"("userId", "followUpStatus");'),await T.default.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "idx_conversation_user_created" ON "Conversation"("userId", "createdAt");'),await T.default.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "idx_conversation_last_msg" ON "Conversation"("lastMessageAt");'),await T.default.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "idx_message_user" ON "Message"("userId");'),await T.default.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "idx_message_conv" ON "Message"("conversationId");'),await T.default.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "idx_message_page" ON "Message"("pageId");'),await T.default.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "idx_message_created" ON "Message"("createdAt");'),await T.default.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "idx_message_user_created" ON "Message"("userId", "createdAt");'),await T.default.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "idx_order_user" ON "Order"("userId");'),await T.default.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "idx_order_page" ON "Order"("pageId");'),await T.default.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "idx_order_status" ON "Order"("status");'),await T.default.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "idx_order_created" ON "Order"("createdAt");'),await T.default.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "idx_order_user_created" ON "Order"("userId", "createdAt");'),await T.default.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "idx_followuplog_user" ON "FollowUpLog"("userId");'),await T.default.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "idx_followuplog_page" ON "FollowUpLog"("pageId");'),await T.default.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "idx_followuplog_conv" ON "FollowUpLog"("conversationId");'),await T.default.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "idx_followuplog_status" ON "FollowUpLog"("status");'),await T.default.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "idx_followuplog_created" ON "FollowUpLog"("createdAt");'),await T.default.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "idx_step_user_page" ON "FollowUpScheduleStep"("userId", "pageId");'),await T.default.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "idx_step_global" ON "FollowUpScheduleStep"("isGlobalDefault");')}catch(e){}try{let e=await T.default.$queryRawUnsafe('PRAGMA table_info("Page");'),a=new Set(e.map(e=>e.name));a.has("channel")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "channel" TEXT NOT NULL DEFAULT \'FACEBOOK\';'),a.has("channelIdentifier")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "channelIdentifier" TEXT;'),a.has("extraConfig")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "extraConfig" TEXT;'),a.has("replyDelaySeconds")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "replyDelaySeconds" INTEGER NOT NULL DEFAULT 3;'),a.has("aiInstructions")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "aiInstructions" TEXT;'),a.has("followUpEnabled")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "followUpEnabled" BOOLEAN NOT NULL DEFAULT 0;'),a.has("followUpWaitMinutes")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "followUpWaitMinutes" INTEGER NOT NULL DEFAULT 30;'),a.has("followUpMessage")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "followUpMessage" TEXT;'),a.has("followUpOnlySeen")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "followUpOnlySeen" BOOLEAN NOT NULL DEFAULT 1;'),a.has("followUpMaxCount")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "followUpMaxCount" INTEGER NOT NULL DEFAULT 1;'),a.has("followUpFrequency")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "followUpFrequency" TEXT NOT NULL DEFAULT \'ONCE\';'),a.has("followUpIntervalHours")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "followUpIntervalHours" INTEGER NOT NULL DEFAULT 24;'),a.has("maxImagesPerConversation")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "maxImagesPerConversation" INTEGER NOT NULL DEFAULT 2;'),a.has("maxImagesPerReply")||await T.default.$executeRawUnsafe('ALTER TABLE "Page" ADD COLUMN "maxImagesPerReply" INTEGER NOT NULL DEFAULT 1;');try{let e=await T.default.$queryRawUnsafe('PRAGMA table_info("User");'),a=new Set(e.map(e=>e.name));a.has("activePackageId")||await T.default.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN "activePackageId" TEXT;'),a.has("avatarUrl")||await T.default.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN "avatarUrl" TEXT;'),a.has("facebookPageUrl")||await T.default.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN "facebookPageUrl" TEXT;'),a.has("phone")||await T.default.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN "phone" TEXT;'),a.has("planStatus")||await T.default.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN "planStatus" TEXT NOT NULL DEFAULT \'INACTIVE\';'),a.has("monthlyMessageLimit")||await T.default.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN "monthlyMessageLimit" INTEGER NOT NULL DEFAULT 500;'),a.has("messagesSentThisMonth")||await T.default.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN "messagesSentThisMonth" INTEGER NOT NULL DEFAULT 0;'),a.has("planExpiresAt")||await T.default.$executeRawUnsafe('ALTER TABLE "User" ADD COLUMN "planExpiresAt" DATETIME;')}catch(e){}try{let e=await T.default.$queryRawUnsafe('PRAGMA table_info("Product");'),a=new Set(e.map(e=>e.name));a.has("images")||await T.default.$executeRawUnsafe('ALTER TABLE "Product" ADD COLUMN "images" TEXT;'),a.has("sku")||await T.default.$executeRawUnsafe('ALTER TABLE "Product" ADD COLUMN "sku" TEXT;'),a.has("category")||await T.default.$executeRawUnsafe('ALTER TABLE "Product" ADD COLUMN "category" TEXT;'),a.has("discountPrice")||await T.default.$executeRawUnsafe('ALTER TABLE "Product" ADD COLUMN "discountPrice" REAL;'),a.has("deliveryInfo")||await T.default.$executeRawUnsafe('ALTER TABLE "Product" ADD COLUMN "deliveryInfo" TEXT;'),a.has("productAiInstructions")||await T.default.$executeRawUnsafe('ALTER TABLE "Product" ADD COLUMN "productAiInstructions" TEXT;')}catch(e){}try{let e=await T.default.$queryRawUnsafe('PRAGMA table_info("Order");'),a=new Set(e.map(e=>e.name));a.has("productId")||await T.default.$executeRawUnsafe('ALTER TABLE "Order" ADD COLUMN "productId" TEXT;'),a.has("price")||await T.default.$executeRawUnsafe('ALTER TABLE "Order" ADD COLUMN "price" REAL NOT NULL DEFAULT 0;'),a.has("totalPrice")||await T.default.$executeRawUnsafe('ALTER TABLE "Order" ADD COLUMN "totalPrice" REAL NOT NULL DEFAULT 0;'),a.has("source")||await T.default.$executeRawUnsafe('ALTER TABLE "Order" ADD COLUMN "source" TEXT NOT NULL DEFAULT \'MESSENGER_AI\';'),a.has("notes")||await T.default.$executeRawUnsafe('ALTER TABLE "Order" ADD COLUMN "notes" TEXT;'),a.has("quantity")||await T.default.$executeRawUnsafe('ALTER TABLE "Order" ADD COLUMN "quantity" INTEGER NOT NULL DEFAULT 1;')}catch(e){}try{let e=await T.default.$queryRawUnsafe('PRAGMA table_info("PackageOrder");'),a=new Set(e.map(e=>e.name));a.has("paymentMethodId")||await T.default.$executeRawUnsafe('ALTER TABLE "PackageOrder" ADD COLUMN "paymentMethodId" TEXT;'),a.has("paymentProofUrl")||await T.default.$executeRawUnsafe('ALTER TABLE "PackageOrder" ADD COLUMN "paymentProofUrl" TEXT;'),a.has("approvedAt")||await T.default.$executeRawUnsafe('ALTER TABLE "PackageOrder" ADD COLUMN "approvedAt" DATETIME;'),a.has("adminNote")||await T.default.$executeRawUnsafe('ALTER TABLE "PackageOrder" ADD COLUMN "adminNote" TEXT;')}catch(e){}try{let e=await T.default.$queryRawUnsafe('PRAGMA table_info("LicenseKey");'),a=new Set(e.map(e=>e.name));a.has("packageId")||await T.default.$executeRawUnsafe('ALTER TABLE "LicenseKey" ADD COLUMN "packageId" TEXT;'),a.has("clientName")||await T.default.$executeRawUnsafe('ALTER TABLE "LicenseKey" ADD COLUMN "clientName" TEXT;'),a.has("clientPhone")||await T.default.$executeRawUnsafe('ALTER TABLE "LicenseKey" ADD COLUMN "clientPhone" TEXT;'),a.has("clientNote")||await T.default.$executeRawUnsafe('ALTER TABLE "LicenseKey" ADD COLUMN "clientNote" TEXT;')}catch(e){}let t=await T.default.$queryRawUnsafe('PRAGMA table_info("Conversation");'),E=new Set(t.map(e=>e.name));E.has("imagesSentCount")||await T.default.$executeRawUnsafe('ALTER TABLE "Conversation" ADD COLUMN "imagesSentCount" INTEGER NOT NULL DEFAULT 0;'),E.has("channel")||await T.default.$executeRawUnsafe('ALTER TABLE "Conversation" ADD COLUMN "channel" TEXT NOT NULL DEFAULT \'FACEBOOK\';'),E.has("lastSeenAt")||await T.default.$executeRawUnsafe('ALTER TABLE "Conversation" ADD COLUMN "lastSeenAt" DATETIME;'),E.has("lastFollowUpSentAt")||await T.default.$executeRawUnsafe('ALTER TABLE "Conversation" ADD COLUMN "lastFollowUpSentAt" DATETIME;'),E.has("followUpSentCount")||await T.default.$executeRawUnsafe('ALTER TABLE "Conversation" ADD COLUMN "followUpSentCount" INTEGER NOT NULL DEFAULT 0;'),E.has("followUpStatus")||await T.default.$executeRawUnsafe('ALTER TABLE "Conversation" ADD COLUMN "followUpStatus" TEXT NOT NULL DEFAULT \'IDLE\';'),E.has("currentFollowUpStep")||await T.default.$executeRawUnsafe('ALTER TABLE "Conversation" ADD COLUMN "currentFollowUpStep" INTEGER NOT NULL DEFAULT 0;'),E.has("nextFollowUpDueAt")||await T.default.$executeRawUnsafe('ALTER TABLE "Conversation" ADD COLUMN "nextFollowUpDueAt" DATETIME;');try{await T.default.$executeRawUnsafe('UPDATE "Page" SET "connectionStatus" = \'PENDING\' WHERE "connectionStatus" IS NULL;')}catch(e){}}catch(e){console.warn("Migration pre-check warning:",e)}}catch(e){console.warn("Raw table creation note:",e)}try{if(!await T.default.user.findFirst({where:{OR:[{role:"ADMIN"},{email:"admin@replyx.ai"},{email:"admin@gmail.com"}]}})){let e=await s().hash("admin123",10);await T.default.user.create({data:{id:"usr_admin_default",fullName:"Super Admin",businessName:"ReplyX AI Platform",email:"admin@replyx.ai",passwordHash:e,role:"ADMIN",status:"ACTIVE",plan:"PRO",planStatus:"ACTIVE",monthlyMessageLimit:999999}})}let e=await T.default.package.count();0===e&&await T.default.package.createMany({data:[{id:"pkg_starter",name:"স্টার্টার প্যাকেজ",slug:"starter",description:"ছোট ব্যবসার জন্য আদর্শ AI অটোমেশন প্যাকেজ",price:990,durationDays:30,messageLimit:1e3,pageLimit:1,productLimit:50,features:JSON.stringify(["১টি ফেসবুক পেজ অটোমেশন","১,০০০ চ্যাট অটো-রিপ্লাই","বাংলা ও ইংলিশ এআই রিপ্লাই","অর্ডার নেওয়ার সুবিধা"]),isPopular:!1,isActive:!0},{id:"pkg_business",name:"বিজনেস প্যাকেজ",slug:"business",description:"মাঝারি সাইজের পেজের জন্য সবচেয়ে জনপ্রিয় প্যাকেজ",price:1990,durationDays:30,messageLimit:3e3,pageLimit:3,productLimit:200,features:JSON.stringify(["৩টি ফেসবুক পেজ সংযোগ","৩,০০০ চ্যাট অটো-রিপ্লাই","প্রোডাক্ট ছবি দেখে ছবিসহ উত্তর","মেসেঞ্জারে অটোমেটিক অর্ডার"]),isPopular:!0,isActive:!0},{id:"pkg_pro",name:"প্রো প্যাকেজ",slug:"pro",description:"বড় ই-কমার্স পেজের জন্য আনলিমিটেড স্কেলিং প্যাকেজ",price:3490,durationDays:30,messageLimit:1e4,pageLimit:10,productLimit:1e3,features:JSON.stringify(["১০টি ফেসবুক পেজ কানেকশন","১০,০০০ চ্যাট অটো-রিপ্লাই","ভয়েস ও টেক্সট দুই চ্যাটেই রিপ্লাই","প্রাইওরিটি কাস্টমার সাপোর্ট"]),isPopular:!1,isActive:!0}]});let a=await T.default.paymentMethod.count();0===a&&await T.default.paymentMethod.createMany({data:[{id:"pm_bkash",name:"BKASH",displayName:"bKash (বিকাশ)",accountType:"PERSONAL",accountNumber:"01800000000",instructions:"Send Money করুন এবং নিচে ট্রানজেকশন আইডি (TrxID) দিন।",isActive:!0},{id:"pm_nagad",name:"NAGAD",displayName:"Nagad (নগদ)",accountType:"PERSONAL",accountNumber:"01700000000",instructions:"Send Money করুন এবং নিচে ট্রানজেকশন আইডি (TrxID) দিন।",isActive:!0},{id:"pm_rocket",name:"ROCKET",displayName:"Rocket (রকেট)",accountType:"PERSONAL",accountNumber:"01900000000",instructions:"Send Money করুন এবং নিচে ট্রানজেকশন আইডি দিন।",isActive:!0}]});let t=await T.default.followUpScheduleStep.count({where:{isGlobalDefault:!0}});0===t&&await T.default.followUpScheduleStep.createMany({data:[{stepNumber:1,dayOffset:1,timeOfDay:"10:00",title:"১ম ফলো-আপ (১ দিন পর - সকাল ১০টা)",guidelinePrompt:"পছন্দের পণ্য নিয়ে কোনো জিজ্ঞাসা আছে কিনা বা অর্ডার কনফার্ম করতে কোনো সহায়তা প্রয়োজন কিনা তা অত্যন্ত আন্তরিক ও বিনম্রভাবে জানতে চান।",isEnabled:!0,isGlobalDefault:!0},{stepNumber:2,dayOffset:3,timeOfDay:"16:00",title:"২য় ফলো-আপ (৩ দিন পর - বিকাল ৪টা)",guidelinePrompt:"পণ্যের প্রিমিয়াম কোয়ালিটি ও ক্যাশ অন ডেলিভারি (COD) সুবিধার কথা মনে করিয়ে দিয়ে অর্ডার কনফার্ম করার সহজ প্রক্রিয়া জানান।",isEnabled:!0,isGlobalDefault:!0},{stepNumber:3,dayOffset:7,timeOfDay:"20:00",title:"৩য় ফলো-আপ (৭ দিন পর - রাত ৮টা)",guidelinePrompt:"স্টক লিমিটেড হতে পারে বা দ্রুত ডেলিভারি সার্ভিসের বন্ধুত্বপূর্ণ রিমাইন্ডার দিন। আগের মেসেজের কথা সরাসরি পুনরাবৃত্তি করবেন না।",isEnabled:!0,isGlobalDefault:!0},{stepNumber:4,dayOffset:15,timeOfDay:"11:00",title:"৪র্থ ফলো-আপ (১৫ দিন পর - সকাল ১১টা)",guidelinePrompt:"কোনো বিশেষ ছাড় বা পছন্দের অন্য কোনো পণ্য দেখতে চান কিনা অথবা কোনো ফিডব্যাক আছে কিনা জানতে চান।",isEnabled:!0,isGlobalDefault:!0},{stepNumber:5,dayOffset:25,timeOfDay:"17:00",title:"৫ম ফলো-আপ (২৫ দিন পর - বিকাল ৫টা)",guidelinePrompt:"মাসের সমাপনী আন্তরিক সম্ভাষণ জানান এবং ভবিষ্যতে যেকোনো পণ্য বা সেবার জন্য যোগাযোগ করতে আমন্ত্রণ জানান।",isEnabled:!0,isGlobalDefault:!0}]}),i=!0;try{(0,n.zw)()}catch(e){}}catch(e){console.error("Error during database self-healing initialization:",e)}finally{o=null}})())}},21431:(e,a,t)=>{t.d(a,{Ks:()=>A,u2:()=>N,zw:()=>c});var T=t(9487),E=t(67297),s=t(87714),n=t(57435),i=t(26729),o=t(84517),l=t(11258),r=t(54214);let L=globalThis,N=[{stepNumber:1,dayOffset:1,timeOfDay:"10:00",title:"১ম ফলো-আপ (১ দিন পর - সকাল ১০টা)",guidelinePrompt:"পছন্দের পণ্য নিয়ে কোনো জিজ্ঞাসা আছে কিনা বা অর্ডার কনফার্ম করতে কোনো সহায়তা প্রয়োজন কিনা তা অত্যন্ত আন্তরিক ও বিনম্রভাবে জানতে চান।",isEnabled:!0,isGlobalDefault:!0},{stepNumber:2,dayOffset:3,timeOfDay:"16:00",title:"২য় ফলো-আপ (৩ দিন পর - বিকাল ৪টা)",guidelinePrompt:"পণ্যের প্রিমিয়াম কোয়ালিটি ও ক্যাশ অন ডেলিভারি (COD) সুবিধার কথা মনে করিয়ে দিয়ে অর্ডার কনফার্ম করার সহজ প্রক্রিয়া জানান।",isEnabled:!0,isGlobalDefault:!0},{stepNumber:3,dayOffset:7,timeOfDay:"20:00",title:"৩য় ফলো-আপ (৭ দিন পর - রাত ৮টা)",guidelinePrompt:"স্টক লিমিটেড হতে পারে বা দ্রুত ডেলিভারি সার্ভিসের বন্ধুত্বপূর্ণ রিমাইন্ডার দিন। আগের মেসেজের কথা সরাসরি পুনরাবৃত্তি করবেন না।",isEnabled:!0,isGlobalDefault:!0},{stepNumber:4,dayOffset:15,timeOfDay:"11:00",title:"৪র্থ ফলো-আপ (১৫ দিন পর - সকাল ১১টা)",guidelinePrompt:"কোনো বিশেষ ছাড় বা পছন্দের অন্য কোনো পণ্য দেখতে চান কিনা অথবা কোনো ফিডব্যাক আছে কিনা জানতে চান।",isEnabled:!0,isGlobalDefault:!0},{stepNumber:5,dayOffset:25,timeOfDay:"17:00",title:"৫ম ফলো-আপ (২৫ দিন পর - বিকাল ৫টা)",guidelinePrompt:"মাসের সমাপনী আন্তরিক সম্ভাষণ জানান এবং ভবিষ্যতে যেকোনো পণ্য বা সেবার জন্য যোগাযোগ করতে আমন্ত্রণ জানান।",isEnabled:!0,isGlobalDefault:!0}];async function u(e,a){try{if(await (0,o.S)(),a){let e=await T.default.followUpScheduleStep.findMany({where:{pageId:a,isEnabled:!0},orderBy:{stepNumber:"asc"}});if(e.length>0)return e}if(e){let a=await T.default.followUpScheduleStep.findMany({where:{userId:e,pageId:null,isEnabled:!0},orderBy:{stepNumber:"asc"}});if(a.length>0)return a}let t=await T.default.followUpScheduleStep.findMany({where:{isGlobalDefault:!0,isEnabled:!0},orderBy:{stepNumber:"asc"}});if(t.length>0)return t}catch(e){n.LI.error("Error fetching schedule steps:",e)}return N}async function d(e){let{customerName:a="গ্রাহক",step:t,conversationHistory:T,previousFollowUps:E,pageName:s,replyLanguage:o="বাংলা",businessInstructions:L=""}=e,N=a?.split(" ")[0]||"সম্মানিত গ্রাহক";try{let e=await (0,i.dG)(),a=e.provider,n=e.model,u=T.slice(-8).map(e=>`${"INCOMING"===e.direction?"Customer":"Page/Shop"}: ${e.text}`).join("\n"),d=E.length>0?E.map((e,a)=>`[Follow-Up #${a+1} Sent]: "${e}"`).join("\n"):"None (This is the 1st follow-up)",U=`You are a high-conversion, extremely polite, natural sales & customer success assistant for "${s}".
Your task is to craft an intelligent, personalized follow-up message to a customer who previously chatted with our page but has not yet placed an order or completed service.

CRITICAL NON-REPETITION & CONTEXT RULES:
1. STRICTLY DO NOT repeat the exact phrases, greetings, or sentences from previous follow-ups listed below.
2. Read the customer's previous conversation history to understand what product or inquiry they were interested in.
3. This is Step #${t.stepNumber} (${t.title}). Step guidance: "${t.guidelinePrompt||"Polite, helpful follow-up."}".
4. Tone: Warm, helpful, respectful, non-pushy, and professional (Bengali e-commerce standard).
5. Language: Use natural ${o} (e.g. Standard Bengali with emojis like 😊, 🛍️, 📦).
6. Length: Concise (1-3 sentences). Do NOT add quotation marks or metadata tags. Return ONLY the raw message to be sent directly to the customer.

[PREVIOUS FOLLOW-UPS SENT TO THIS CUSTOMER (DO NOT REPEAT THESE)]:
${d}

[BUSINESS INSTRUCTIONS / POLICIES]:
${L||"Cash on Delivery (COD) available all over Bangladesh. Fast delivery."}
`,A=`[CUSTOMER NAME]: ${N}
[PREVIOUS CHAT HISTORY]:
${u||"Customer previously greeted and asked for product information."}

Please craft the Step #${t.stepNumber} follow-up message now:`;if("GEMINI"===a){let a=e.geminiKey||process.env.GEMINI_API_KEY||"";if(a){let e=new l.$D(a).getGenerativeModel({model:n||"gemini-1.5-flash",systemInstruction:U,generationConfig:{temperature:.75,maxOutputTokens:250}}),t=(await e.generateContent(A)).response.text().trim().replace(/^["']|["']$/g,"");if(t)return{text:t,model:`GEMINI:${n||"gemini-1.5-flash"}`}}}else if("OPENAI"===a){let a=e.openaiKey||process.env.OPENAI_API_KEY||"";if(a){let e=new r.ZP({apiKey:a}),t=await e.chat.completions.create({model:n||"gpt-4o-mini",messages:[{role:"system",content:U},{role:"user",content:A}],temperature:.75,max_tokens:250}),T=t.choices[0]?.message?.content?.trim().replace(/^["']|["']$/g,"");if(T)return{text:T,model:`OPENAI:${n||"gpt-4o-mini"}`}}}else if("DEEPSEEK"===a||"GOROUTER"===a||"OPENROUTER"===a){let t="DEEPSEEK"===a?e.deepseekKey||process.env.DEEPSEEK_API_KEY||"":e.gorouterKey||process.env.GOROUTER_API_KEY||"",T="DEEPSEEK"===a?"https://api.deepseek.com/v1":e.gorouterBaseUrl;if(t){let e=new r.ZP({apiKey:t,baseURL:T}),E=await e.chat.completions.create({model:n||("DEEPSEEK"===a?"deepseek-chat":"deepseek/deepseek-chat"),messages:[{role:"system",content:U},{role:"user",content:A}],temperature:.75,max_tokens:250}),s=E.choices[0]?.message?.content?.trim().replace(/^["']|["']$/g,"");if(s)return{text:s,model:`${a}:${n||"chat"}`}}}}catch(e){n.LI.warn("AI follow-up generation failed, falling back to smart dynamic template:",e)}let u="";switch(t.stepNumber){case 1:u=`আসসালামু আলাইকুম ${N}! আপনার পছন্দের পণ্যটি নিয়ে কোনো প্রশ্ন ছিল কি? কোনো সহায়তা লাগলে জানাবেন, আমরা এখনই অর্ডার কনফার্ম করে দিচ্ছি! 😊🛍️`;break;case 2:u=`প্রিয় ${N}, আশা করি ভালো আছেন। আমাদের পণ্যটিতে ক্যাশ অন ডেলিভারি (COD) এবং দ্রুত ডেলিভারির সুবিধা রয়েছে। আপনার অর্ডারটি কি কনফার্ম করে দেব? 📦✨`;break;case 3:u=`হ্যালো ${N}! আপনার পছন্দের প্রোডাক্টটির স্টক কিন্তু সীমিত। আপনি চাইলে আপনার জন্য স্টক হোল্ড করে রাখতে পারি। জানাতে পারেন! 😊`;break;case 4:u=`আসসালামু আলাইকুম ${N}, কোনো বিশেষ অফার বা অন্য কোনো প্রোডাক্ট দেখতে চাইলে আমাদের জানাতে পারেন। আপনার সেবায় আমরা সর্বদা প্রস্তুত! 🌟`;break;default:u=`শ্রদ্ধেয় ${N}, আমাদের সাথে যুক্ত থাকার জন্য আন্তরিক ধন্যবাদ। যেকোনো সময় পণ্য বা সেবার জন্য আমাদের মেসেজ দিতে পারেন। শুভকামনা! 💐`}return{text:u,model:"TEMPLATE_FALLBACK"}}function U(e){if(e.timeOfDay?.startsWith("MIN:")){let a=parseInt(e.timeOfDay.replace("MIN:",""),10);return isNaN(a)||a<=0?1:a}if(e.timeOfDay?.startsWith("HR:")){let a=parseInt(e.timeOfDay.replace("HR:",""),10);return isNaN(a)||a<=0?60:60*a}if(0===e.dayOffset&&e.timeOfDay?.includes(":")){let[a,t]=e.timeOfDay.split(":").map(Number);if(!isNaN(a)&&!isNaN(t))return Math.max(1,60*a+t)}return 1440*Math.max(1,e.dayOffset||1)}async function A(e){let a=[],t=0;try{await (0,o.S)();let i={followUpEnabled:!0,connectionStatus:{not:"DISCONNECTED"}};e&&(i.id=e);let l=await T.default.page.findMany({where:i});for(let e of l){let i=(0,E.pe)(e.pageAccessTokenEncrypted);if(!i)continue;let o={};if(e.extraConfig)try{o=JSON.parse(e.extraConfig)}catch(e){}let l=await u(e.userId,e.id);if(0===l.length)continue;let r=new Date(Date.now()-3024e6);for(let E of(await T.default.conversation.findMany({where:{pageId:e.id,status:"ACTIVE",aiEnabled:!0,followUpStatus:{notIn:["COMPLETED","PAUSED","ORDER_PLACED","CUSTOMER_REPLIED"]},lastMessageAt:{gte:r}},include:{messages:{orderBy:{createdAt:"desc"},take:10},orders:{where:{createdAt:{gte:r}},take:1},followUpLogs:{orderBy:{createdAt:"asc"},take:10}},take:100}))){let r=E.channel||e.channel||"FACEBOOK",L=E.customerName||E.senderPsid;if(E.orders&&E.orders.length>0){await T.default.conversation.update({where:{id:E.id},data:{followUpStatus:"ORDER_PLACED"}});continue}let N=E.messages[0];if(N&&"INCOMING"===N.direction){(E.currentFollowUpStep>0||E.followUpSentCount>0)&&await T.default.conversation.update({where:{id:E.id},data:{followUpStatus:"CUSTOMER_REPLIED"}});continue}let u=e.followUpMaxCount??5;if(u<999&&E.followUpSentCount>=u||"ONCE"===e.followUpFrequency&&E.followUpSentCount>=1){await T.default.conversation.update({where:{id:E.id},data:{followUpStatus:"COMPLETED"}});continue}let A=E.currentFollowUpStep||0;if(A>=l.length){await T.default.conversation.update({where:{id:E.id},data:{followUpStatus:"COMPLETED"}});continue}let c=l[A];if(e.followUpOnlySeen){if(!E.lastSeenAt)continue;let e=E.messages.find(e=>"OUTGOING"===e.direction);if(e&&new Date(E.lastSeenAt).getTime()<new Date(e.createdAt).getTime()-1e4)continue}let f=Date.now(),O=!1;if(0===A){let a=e.followUpOnlySeen&&E.lastSeenAt?new Date(E.lastSeenAt).getTime():E.lastMessageAt?new Date(E.lastMessageAt).getTime():new Date(E.createdAt).getTime(),t=U(c);1!==c.dayOffset||c.timeOfDay?.startsWith("MIN:")||c.timeOfDay?.startsWith("HR:")||!((e.followUpWaitMinutes??30)<1440)||(t=e.followUpWaitMinutes??30);let T=6e4*Math.max(1,t);f-a>=T&&(O=!0)}else if(E.lastFollowUpSentAt){let a=new Date(E.lastFollowUpSentAt).getTime(),t=l[A-1],T=U(c),s=t?U(t):0,n=T>s?T-s:T;"DAILY"!==e.followUpFrequency||c.timeOfDay?.startsWith("MIN:")?"CUSTOM_INTERVAL"===e.followUpFrequency&&!c.timeOfDay?.startsWith("MIN:")&&e.followUpIntervalHours&&c.dayOffset>0&&(n=Math.max(n,60*e.followUpIntervalHours)):n=Math.max(n,1440);let i=6e4*Math.max(1,n);f-a>=i&&(O=!0)}else O=!0;if(!O)continue;let I="",p="CUSTOM_TEMPLATE";if(e.followUpMessage&&e.followUpMessage.trim().length>0){let a=E.customerName?.split(" ")[0]||"গ্রাহক";I=e.followUpMessage.replace(/{name}/gi,a).replace(/{customer_name}/gi,a).replace(/{page_name}/gi,e.pageName)}else{let a=(E.followUpLogs||[]).map(e=>e.messageText).filter(e=>"string"==typeof e&&e.trim().length>0),t=[...E.messages].reverse().map(e=>({direction:e.direction,text:e.messageText||""})),T=await d({conversationId:E.id,customerName:E.customerName,step:c,conversationHistory:t,previousFollowUps:a,pageName:e.pageName,replyLanguage:e.replyLanguage||"বাংলা",businessInstructions:e.aiInstructions||""});I=T.text,p=T.model}if(!I||0===I.trim().length)continue;let w=await (0,s.Wi)({channel:r,recipientId:E.senderPsid,text:I,accessToken:i,channelIdentifier:e.channelIdentifier||e.facebookPageId,extraConfig:o});if(w.success){t++;let s=A+1>=l.length||"ONCE"===e.followUpFrequency,i=s?"COMPLETED":"IN_PROGRESS",o=A+1,N=null;if(!s){let a="CUSTOM_INTERVAL"===e.followUpFrequency&&e.followUpIntervalHours||24;N=new Date(Date.now()+36e5*a)}await T.default.followUpLog.create({data:{userId:e.userId,pageId:e.id,conversationId:E.id,stepNumber:c.stepNumber,dayOffset:c.dayOffset,scheduledTime:c.timeOfDay,messageText:I,channel:r,customerName:E.customerName,senderPsid:E.senderPsid,status:"SENT",aiModel:p}}),await T.default.message.create({data:{conversationId:E.id,userId:e.userId,pageId:e.id,senderPsid:E.senderPsid,direction:"OUTGOING",messageType:"TEXT",messageText:I,aiGenerated:!0,aiModel:p}}),await T.default.conversation.update({where:{id:E.id},data:{currentFollowUpStep:o,followUpStatus:i,lastFollowUpSentAt:new Date,lastMessage:I,lastMessageAt:new Date,followUpSentCount:{increment:1},nextFollowUpDueAt:N}}),await (0,n.ag)({userId:e.userId,pageId:e.id,action:"FOLLOW_UP_SENT",description:`স্বয়ংক্রিয় ধাপ #${c.stepNumber} ফলো-আপ পাঠানো হয়েছে (${L}, ${r})`}),a.push({pageId:e.id,conversationId:E.id,customer:L,status:"SENT",channel:r,stepNumber:c.stepNumber}),n.LI.info(`[Follow-Up] Step #${c.stepNumber} sent to ${L} (${r})`)}else await T.default.followUpLog.create({data:{userId:e.userId,pageId:e.id,conversationId:E.id,stepNumber:c.stepNumber,dayOffset:c.dayOffset,scheduledTime:c.timeOfDay,messageText:I,channel:r,customerName:E.customerName,senderPsid:E.senderPsid,status:`FAILED: ${w.error||"API Error"}`,aiModel:p}}),a.push({pageId:e.id,conversationId:E.id,customer:L,status:`FAILED: ${w.error||"API Error"}`,channel:r,stepNumber:c.stepNumber})}}return{scannedPages:l.length,sentCount:t,results:a}}catch(e){return n.LI.error("Error running follow-up automation:",e),{scannedPages:0,sentCount:0,results:a}}}function c(e=6e4){!L.followUpWorkerInterval&&(n.LI.info(`[Follow-Up Worker] Background automation engine active (interval: ${e/1e3}s)`),L.followUpWorkerInterval=setInterval(async()=>{if(!L.isFollowUpWorkerRunning){L.isFollowUpWorkerRunning=!0;try{let e=await A();e.sentCount>0&&n.LI.info(`[Follow-Up Worker] Dispatched ${e.sentCount} follow-up message(s)`)}catch(e){n.LI.error("[Follow-Up Worker] Scheduled run error:",e)}finally{L.isFollowUpWorkerRunning=!1}}},e),L.followUpWorkerInterval&&"function"==typeof L.followUpWorkerInterval.unref&&L.followUpWorkerInterval.unref())}}};