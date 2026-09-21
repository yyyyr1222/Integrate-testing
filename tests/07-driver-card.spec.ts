import {
  test,
  expect,
  BrowserContext,
  Page,
} from '@playwright/test';
import path from 'path';

// =====================================================
// DRIVER
// ทำหน้าที่แทน Layer ด้านบน (เช่น Login/Inventory จริง)
// โดยเปิด card.html (Stub) โดยตรงผ่าน file:// path
// รูปแบบ: DRIVER -> STUB (FAKE -> FAKE ในตัวอย่างนี้ เพราะ
// card.html คือ stub ใหม่ที่สร้างขึ้นสำหรับแบบฝึกหัดนี้)
// =====================================================
async function driverOpenCard(context: BrowserContext): Promise<Page> {
  const page = await context.newPage();
  const cardPath = path.resolve(__dirname, 'card.html');
  await page.goto(`file://${cardPath}`);

  // ตรวจว่า stub เปิดขึ้นมาได้จริง
  await expect(page.locator('[data-test="stub-inventory"]')).toBeVisible();

  return page;
}

test('Driver -> card.html: เปิด stub และตรวจสอบชื่อ-นามสกุล', async ({ browser }) => {
  const context = await browser.newContext();
  try {
    // ===================================================
    // Driver เรียกเปิด card.html แทนการเรียก Module จริง
    // ===================================================
    const page = await driverOpenCard(context);

    // ===================================================
    // ทดสอบว่ามีชื่อและนามสกุลของตัวเองอยู่ใน stub หรือไม่
    // (ตามที่โจทย์กำหนดให้เขียนการทดสอบข้อนี้ไว้)
    // ===================================================
    await expect(page.locator('[data-test="student-name"]'))
      .toContainText('ชื่อ-นามสกุล:');

    // ตัวอย่าง assertion เจาะจงชื่อ (แก้ค่าด้านล่างให้ตรงกับชื่อจริงที่ใส่ใน card.html)
    await expect(page.locator('[data-test="student-name"]'))
      .toContainText('นัฐภัทร การดี ');

    // ===================================================
    // ตรวจสอบเนื้อหา stub inventory อื่น ๆ
    // ===================================================
    await expect(page.locator('[data-test="stub-inventory"]'))
      .toContainText('Fake Inventory from Stub Card');
  } finally {
    await context.close();
  }
});

// Run:
// npx playwright test tests/07-driver-card.spec.ts --headed
