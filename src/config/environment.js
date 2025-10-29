import fs from 'fs/promises'; // Use the promises API
import path from 'path'; // For handling file paths

/**
 * Reads .env file and extracts all variable names
 */
export const readEnvFile = async () => {
  try {
    // Read the .env file
    const envPath = path.resolve(process.cwd(), '.env');
    // Read file content
    const envContent = await fs.readFile(envPath, 'utf8');
    // Extract variable names
    const envVars = envContent
      .split('\n')
      .filter((line) => {
        const trimmed = line.trim();
        // Ignore empty lines, comments, lines without '=',
        // and lines starting with 'export '
        return (
          trimmed &&
          !trimmed.startsWith('#') &&
          trimmed.includes('=') &&
          !trimmed.startsWith('export ')
        );
      }) // Filter valid lines
      .map((line) => line.split('=')[0].trim())
      // Remove any empty names
      .filter((varName) => varName && varName !== '');
    return envVars;
  } catch (error) {
    console.warn('⚠️ Could not read .env file:', error.message);
    return [];
  }
};

/**
 * Validates that all variables from .env are present in process.env
 */
export const validateEnvironment = async () => {
  try {
    // Read variable names from .env file
    const envFileVars = await readEnvFile();

    if (envFileVars.length === 0) {
      console.warn('⚠️ No environment variables found in .env file');
      return;
    }
    // Check for missing variables in process.env
    const missingVars = envFileVars.filter(
      (varName) => !process.env[varName] || process.env[varName].trim() === ''
    );
    // If any are missing, log error and exit
    if (missingVars.length > 0) {
      console.error('❌ Missing environment variables:', missingVars);
      console.log('💡 Please check your .env file or environment');
      process.exit(1);
    }
    // All variables are present
    console.log(`✅ All ${envFileVars.length} environment variables are set`);
  } catch (error) {
    console.error('❌ Error validating environment:', error.message);
    process.exit(1);
  }
};
