import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

dotenv.config({});

class Config {
  public ENABLE_APM: string | undefined;
  public GATEWAY_JWT_JOKEN: string | undefined;
  public JWT_TOKEN: string | undefined;
  public NODE_ENV: string | undefined;
  public CLIENT_URL: string | undefined;
  public AUTH_BASE_URL: string | undefined;
  public RABBITMQ_ENDPOINT: string | undefined;
  public MYSQL_DB: string | undefined;
  public CLOUD_NAME: string | undefined;
  public CLOUD_API_KEY: string | undefined;
  public CLOUD_API_SECRET: string | undefined;
  public ELASTIC_SEARCH_URL: string | undefined;
  public ELASTIC_APM_SERVER_URL: string | undefined;
  public ELASTIC_APM_SECRET_TOKEN: string | undefined;

  constructor() {
    this.ENABLE_APM = process.env.ENABLE_APM || '';
    (this.GATEWAY_JWT_JOKEN = process.env.GATEWAY_JWT_JOKEN || '1234'),
      (this.JWT_TOKEN = process.env.JWT_TOKEN || '1234'),
      (this.NODE_ENV = process.env.NODE_ENV || ''),
      (this.CLIENT_URL = process.env.CLIENT_URL || ''),
      (this.AUTH_BASE_URL = process.env.AUTH_BASE_URL || ''),
      (this.RABBITMQ_ENDPOINT = process.env.RABBITMQ_ENDPOINT || ''),
      (this.MYSQL_DB = process.env.MYSQL_DB || ''),
      (this.CLOUD_NAME = process.env.CLOUD_NAME || ''),
      (this.CLOUD_API_KEY = process.env.CLOUD_API_KEY || ''),
      (this.CLOUD_API_SECRET = process.env.CLOUD_API_SECRET || ''),
      (this.ELASTIC_SEARCH_URL = process.env.ELASTIC_SEARCH_URL || ''),
      (this.ELASTIC_APM_SERVER_URL = process.env.ELASTIC_APM_SERVER_URL || ''),
      (this.ELASTIC_APM_SECRET_TOKEN = process.env.ELASTIC_APM_SECRET_TOKEN || '');
  }

  public cloudinaryConfig(): void {
    cloudinary.v2.config({
      cloud_name: this.CLOUD_NAME,
      api_key: this.CLOUD_API_KEY,
      api_secret: this.CLOUD_API_SECRET
    });
  }
}

export const config: Config = new Config();
