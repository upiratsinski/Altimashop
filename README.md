# Alza Demo Shop

15 demoShop UI tests using **TypeScript, Playwright and Google Chrome**, organised with the Page Object Model.

## Setup and run

Requirements: **Git, Node.js 24 LTS (with npm) and Google Chrome**. The commands below use Windows PowerShell.

```powershell
git clone https://github.com/upiratsinski/Alza-Demo-Shop.git
cd Alza-Demo-Shop
npm ci
Copy-Item .env.example .env
```

Open `.env` and enter the shop's `SHOP_USERNAME` and `SHOP_PASSWORD`. Credentials are supplied separately; they are not included in the repository. `.env` is ignored by Git and is read for both VS Code Testing and terminal runs.

If Chrome is not installed, install it with `npx playwright install chrome`.

```powershell
npm test
npm run test:headed
npm run test:ui
npm run typecheck
npm run report
```

For VS Code, open the cloned folder, install the recommended **Playwright Test** extension from Microsoft and open **Testing**. **Ctrl+Shift+B** runs the suite in visible Chrome windows.

## Tests

| Number | File | What the test checks |
| --- | --- | --- |
| 1 | home.spec.ts | Home page title and all 15 catalogue products. |
| 2 | home.spec.ts | Accessories filter and return to the full catalogue. |
| 3 | home.spec.ts | All catalogue prices sorted from low to high. |
| 4 | home.spec.ts | Wireless Mouse details: address, name and image. |
| 5 | cart.spec.ts | Adding a mouse: catalogue count, cart count and total 30. |
| 6 | cart.spec.ts | Changing quantity: two mice cost 60, one costs 30. |
| 7 | cart.spec.ts | Removing the last item removes the cart badge and checkout button. |
| 8 | checkout.spec.ts | Valid customer details, order confirmation, address, total and empty cart. |
| 9 | checkout.spec.ts | Invalid email shows an error and disables Pay. |
| 10 | checkout.spec.ts | Invalid Czech phone number shows an error and disables Pay. |
| 11 | checkout.spec.ts | Empty required City disables Pay. Known application bug. |
| 12 | checkout.spec.ts | FREESHIP8 removes home delivery: total changes from 45 to 30. |
| 13 | admin.spec.ts | Add and delete a product; verify both admin and shop. |
| 14 | admin.spec.ts | Saving price 50 keeps price 50. Known application bug: saves 60. |
| 15 | admin.spec.ts | Download products.xlsx; verify completion, name and non-empty ZIP container. |

Verified on 11 October 2026: **13 passed, 2 failed** in 36.4 seconds. TypeScript validation passed. Tests 11 and 14 reproduce known application bugs, so `npm test` currently returns exit code 1.

The download test checks the downloaded file, not its spreadsheet rows or column values.

## Project layout

- `tests/*.spec.ts`: named tests, setup hooks and Page Object method calls.
- `tests/pages/`: one Page Object per page, with named selectors at the top and commented methods below.
- `tests/data/`: customer, product and expected-result data.
- `tests/support/shopAccess.ts`: shared Basic Auth setup using environment variables.
- `playwright.config.ts`: environment file, Chrome and test report settings.

Each test uses a fresh browser context with separate localStorage. UI tests only; no API tests.

Reports are generated in `playwright-report/`. Failure screenshots and traces are saved in `test-results/`. These folders and credentials are excluded from Git.

