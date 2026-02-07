# Setup Instructions

## Package Setup (packages/sanitaize)

1. **Install dependencies**

    ```bash
    cd packages/sanitaize
    npm install
    ```

2. **Configure environment variables**

    ```bash
    cp .env.example .env
    ```

    Edit `.env` and add your OpenAI API key:

    ```
    OPENAI_API_KEY=sk-your-actual-api-key-here
    ```

3. **Build the package**
    ```bash
    npm run build
    ```

## Demo App Setup (apps/sanitaize)

1. **Install dependencies**

    ```bash
    cd apps/sanitaize
    npm install
    ```

2. **Link the local package**

    ```bash
    npm install ../../packages/sanitaize
    ```

3. **Configure environment variables**

    ```bash
    cp .env.example .env.local
    ```

    Edit `.env.local` and add your OpenAI API key:

    ```
    OPENAI_API_KEY=sk-your-actual-api-key-here
    ```

4. **Run the development server**

    ```bash
    npm run dev
    ```

5. **Open in browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Getting an OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key and paste it into your `.env` files

## Testing the Package

Run the example script:

```bash
cd packages/sanitaize
node --loader ts-node/esm example.ts
```

Make sure you have set `OPENAI_API_KEY` in your environment or `.env` file first.
