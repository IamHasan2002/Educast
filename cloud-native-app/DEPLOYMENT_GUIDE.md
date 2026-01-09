# 🚀 Deployment & GitHub Guide

This guide covers how to push your code to GitHub and deploy it to Azure App Service as per the coursework requirements.

## Part 1: GitHub Setup (The "Git Part")

### 1. Initialize Local Git
I have already created a `.gitignore` file for you to keep the repository clean (ignoring `node_modules` and `.env`).

Run these commands in your terminal (VS Code Terminal):

```powershell
# 1. Initialize Git
git init

# 2. Add all files
git add .

# 3. Commit
git commit -m "Final Submission Code"
```

### 2. Push to GitHub
1.  Go to [github.com](https://github.com) and sign in.
2.  Click **New Repository** (Top right `+`).
3.  Name it `EduCast-Cloud-Native`.
4.  Select **Public** or **Private** (Private is safer for coursework).
5.  Click **Create repository**.
6.  Copy the commands under **"…or push an existing repository from the command line"**. They looks like this:

```powershell
git remote add origin https://github.com/YOUR_USERNAME/EduCast-Cloud-Native.git
git branch -M main
git push -u origin main
```
7.  Paste and run them in your terminal. Your code is now on GitHub!

### ⚠️ Troubleshooting: "Author identity unknown"
If you see an error saying `*** Please tell me who you are`, run these two commands in your terminal:

1.  **Set your Name** (I got this from your screenshot):
    ```powershell
    git config --global user.name "MD Tazimul Hasan"
    ```

2.  **Set your Email** (Replace with your actual university email):
    ```powershell
    git config --global user.email "your.email@university.ac.uk"
    ```

Then try the `git commit` command again.

---

## Part 2: Azure Resources (The "User Actions")

Go to the [Azure Portal](https://portal.azure.com).

### 1. Create Web App (App Service)
1.  Search for **"App Services"** -> **Create**.
2.  **Resource Group:** Create new (e.g., `EduCast-RG`).
3.  **Name:** Unique name (e.g., `educast-yourname`).
4.  **Publish:** Code.
5.  **Runtime stack:** `Node 18 LTS` (or 20).
6.  **Operating System:** Linux.
7.  **Region:** UK South (or nearest).
8.  **Plan:** Free (F1) or Basic (B1).
9.  Click **Review + create** -> **Create**.

### 2. Create Database (Cosmos DB)
*(If you already have a Cosmos DB from a previous lab, you can reuse it! Just skip to step 7).*

1.  Search for **"Azure Cosmos DB"** -> **Create**.
2.  Select **Azure Cosmos DB for NoSQL**.
3.  **Resource Group:** Select `EduCast-RG`.
4.  **Account Name:** Unique name (e.g., `educast-db-yourname`).
5.  **Capacity Mode:** Serverless (Cheaper/Free tier).
6.  Click **Review + create** -> **Create**.
7.  **Once created (or if you already have one):** Go to resource -> **Keys (or Data Explorer)** -> Copy `PRIMARY CONNECTION STRING`.

### 3. Create Storage (Blob)
*(Same here! If you have an existing Storage Account, you can reuse it).*

1.  Search for **"Storage accounts"** -> **Create**.
2.  **Resource Group:** `EduCast-RG`.
3.  **Name:** Unique name (e.g., `educaststorageyourname`) - *lowercase only*.
4.  **Redundancy:** LRS (Locally-redundant storage) is cheapest.
5.  Click **Review + create** -> **Create**.
6.  **Once created (or if reused):** Go to resource -> **Access keys** -> Copy `Connection string`.

---

## Part 3: Connecting It All (Deployment)

### 1. Configure Envrionment Variables
Go to your **App Service** in Azure Portal.
1.  On left menu, click **Settings** -> **Environment variables** (or Configuration).
2.  Click **Add** (App Setting). Add these three:
    *   **Name:** `COSMOS_CONNECTION_STRING`
        **Value:** *(Paste Connection String from Part 2)*
    *   **Name:** `AZURE_STORAGE_CONNECTION_STRING`
        **Value:** *(Paste Connection String from Part 3)*
    *   **Name:** `APPINSIGHTS_INSTRUMENTATIONKEY`
        **Value:**
        1.  Search for **"Application Insights"** in the top search bar.
        2.  Click on the resource (it usually has the same name as your App Service).
        3.  On the **Overview** page (top right), copy the **"Instrumentation Key"**.
3.  Click **Apply** -> **Confirm**.

### 2. Connect GitHub (CI/CD)
1.  On App Service left menu, click **Deployment Center**.
2.  **Source:** GitHub.
3.  **Sign in** to authorize Azure to access your GitHub.
4.  **Organization:** Your username.
5.  **Repository:** `EduCast-Cloud-Native`.
6.  **Branch:** `main`.
7.  **Workflow Option:** Select "Add a workflow".
8.  **Authentication:** "User-assigned identity" is fine.
9.  Click **Preview file** (Button at the bottom).
10. **THEN** look for the **Save** button at the **very top left** of the menu bar.

Azure will now pull your code, build it (`npm install`), and deploy it.
Wait 2-3 minutes. Visit your App URL. **Done!** 🚀

---

## Part 4: Final Verification ✅

**What to do right now:**

1.  **Check GitHub Actions:**
    *   Go to your GitHub repository -> **Actions** tab.
    *   You should see a workflow with a **Green Checkmark** ✅ (if it failed before, the new one "Fix: Add start..." should pass).

2.  **Check Your Website:**
    *   Go to your Azure App URL (e.g., `https://educast-yourname.azurewebsites.net`).
    *   It should load the login page!

3.  **Start Recording:**
    *   Once the site works, you are ready to record your **5-minute video** for the coursework.
    *   Follow the **CHECKLIST.md** I made for you to know what to show in the video.

**Good Luck!** 🎓
