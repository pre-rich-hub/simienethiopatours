// Local type declaration for helmet.
//
// helmet's package.json exports map ("import"/"require" only, no "types"
// condition) makes the resolved default export type environment-dependent
// under moduleResolution: NodeNext. This declaration pins the shape so the
// build behaves identically everywhere (local dev, CI, Vercel).

declare module "helmet" {
  import type { RequestHandler } from "express";

  interface HelmetOptions {
    contentSecurityPolicy?: Record<string, unknown> | boolean;
    crossOriginEmbedderPolicy?: Record<string, unknown> | boolean;
    crossOriginOpenerPolicy?: Record<string, unknown> | boolean;
    crossOriginResourcePolicy?: Record<string, unknown> | boolean;
    originAgentCluster?: boolean;
    referrerPolicy?: Record<string, unknown> | boolean;
    strictTransportSecurity?: Record<string, unknown> | boolean;
    xContentTypeOptions?: Record<string, unknown> | boolean;
    xDnsPrefetchControl?: Record<string, unknown> | boolean;
    xDownloadOptions?: Record<string, unknown> | boolean;
    xFrameOptions?: Record<string, unknown> | boolean;
    xPermittedCrossDomainPolicies?: Record<string, unknown> | boolean;
    xPoweredBy?: Record<string, unknown> | boolean;
    xXssProtection?: Record<string, unknown> | boolean;
  }

  declare function helmet(options?: HelmetOptions): RequestHandler;

  export default helmet;
}