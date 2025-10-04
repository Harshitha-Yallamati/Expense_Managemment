-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MANAGER', 'EMPLOYEE');

-- CreateEnum
CREATE TYPE "ExpenseCategory" AS ENUM ('TRAVEL', 'FOOD', 'ACCOMMODATION', 'TRANSPORTATION', 'OFFICE_SUPPLIES', 'ENTERTAINMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "ExpenseStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'APPROVED', 'REJECTED', 'PARTIALLY_APPROVED');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "WorkflowType" AS ENUM ('SEQUENTIAL', 'PERCENTAGE', 'MANDATORY', 'HYBRID');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'EMPLOYEE',
    "company" TEXT NOT NULL,
    "managerId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "defaultCurrency" TEXT NOT NULL DEFAULT 'USD',
    "adminId" TEXT NOT NULL,
    "workflowType" "WorkflowType" NOT NULL DEFAULT 'SEQUENTIAL',
    "percentageRequired" INTEGER NOT NULL DEFAULT 100,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "originalAmount" DOUBLE PRECISION NOT NULL,
    "originalCurrency" TEXT NOT NULL DEFAULT 'USD',
    "convertedAmount" DOUBLE PRECISION NOT NULL,
    "companyCurrency" TEXT NOT NULL DEFAULT 'USD',
    "exchangeRate" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "category" "ExpenseCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "receiptUrl" TEXT,
    "status" "ExpenseStatus" NOT NULL DEFAULT 'PENDING',
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "workflowType" "WorkflowType" NOT NULL DEFAULT 'SEQUENTIAL',
    "percentageRequired" INTEGER NOT NULL DEFAULT 100,
    "finalComments" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Expense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApprovalStep" (
    "id" TEXT NOT NULL,
    "expenseId" TEXT NOT NULL,
    "stepNumber" INTEGER NOT NULL,
    "approverRole" TEXT NOT NULL,
    "approverId" TEXT,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "comments" TEXT,
    "isMandatory" BOOLEAN NOT NULL DEFAULT false,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApprovalStep_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_company_idx" ON "User"("company");

-- CreateIndex
CREATE UNIQUE INDEX "Company_name_key" ON "Company"("name");

-- CreateIndex
CREATE INDEX "Company_name_idx" ON "Company"("name");

-- CreateIndex
CREATE INDEX "Expense_employeeId_idx" ON "Expense"("employeeId");

-- CreateIndex
CREATE INDEX "Expense_status_idx" ON "Expense"("status");

-- CreateIndex
CREATE INDEX "Expense_submittedAt_idx" ON "Expense"("submittedAt");

-- CreateIndex
CREATE INDEX "ApprovalStep_expenseId_idx" ON "ApprovalStep"("expenseId");

-- CreateIndex
CREATE INDEX "ApprovalStep_approverId_status_idx" ON "ApprovalStep"("approverId", "status");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Expense" ADD CONSTRAINT "Expense_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalStep" ADD CONSTRAINT "ApprovalStep_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "Expense"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApprovalStep" ADD CONSTRAINT "ApprovalStep_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
