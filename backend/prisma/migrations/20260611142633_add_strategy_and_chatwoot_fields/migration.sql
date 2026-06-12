-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'CLIENT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Inmobiliaria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyName" TEXT,
    "whatsappNumber" TEXT,
    "xmlUrl" TEXT,
    "agentTrainingPrompt" TEXT,
    "planType" TEXT NOT NULL DEFAULT 'DEMO',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "activatedAt" DATETIME,
    "expiresAt" DATETIME,
    "registrationIp" TEXT,
    "registrationFingerprint" TEXT,
    "llmProvider" TEXT,
    "llmApiKey" TEXT,
    "evolutionInstanceName" TEXT,
    "chatwootAccountId" TEXT,
    "chatwootInboxId" TEXT,
    "chatwootToken" TEXT,
    "strategyConfig" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Inmobiliaria_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "externalId" TEXT,
    "inmobiliariaId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL,
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "location" TEXT,
    "type" TEXT,
    "bedrooms" INTEGER,
    "bathrooms" INTEGER,
    "area" REAL,
    "images" TEXT,
    "sourceUrl" TEXT,
    "lastUpdate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Property_inmobiliariaId_fkey" FOREIGN KEY ("inmobiliariaId") REFERENCES "Inmobiliaria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WorkflowConfig" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "inmobiliariaId" TEXT NOT NULL,
    "workflowType" TEXT NOT NULL,
    "n8nWorkflowId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "config" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WorkflowConfig_inmobiliariaId_fkey" FOREIGN KEY ("inmobiliariaId") REFERENCES "Inmobiliaria" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SecurityLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "ipAddress" TEXT NOT NULL,
    "fingerprint" TEXT,
    "action" TEXT NOT NULL,
    "email" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Inmobiliaria_userId_key" ON "Inmobiliaria"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Inmobiliaria_evolutionInstanceName_key" ON "Inmobiliaria"("evolutionInstanceName");
