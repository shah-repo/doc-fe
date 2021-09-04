
export interface SMStoreProps {
  data: Map<string, any>;
  loading: Map<string, boolean>;
}

export type SMStoreRequestMethod = "get" | "post" | "patch" | "delete";

interface SMStoreResponse {
  abort: () => void;
  promise: Promise<any>;
}

export interface SMStoreAdapter {
  get(path: string, data?: {}, options?: {}): SMStoreResponse;
  patch(path: string, data?: {}, options?: {}): SMStoreResponse;
  post(path: string, data?: {}, options?: {}): SMStoreResponse;
  put(path: string, data?: {}, options?: {}): SMStoreResponse;
  del(path: string, data?: {}, options?: {}): SMStoreResponse;
}

// interface SMStoreRequestProps<Response, Body> {
//   /**
//    * @cfg {string} Request url definition.
//    */
//   url?: string;
//   /**
//    * @cfg {string} Response data mapping.
//    */
//   mapping: string;
//   /**
//    * @cfg {bool} Omit header authorization if false.
//    * Default to true.
//    */
//   authorize?: boolean;
//   /**
//    * @cfg {object} Payload.
//    */
//   body?: Body;
//   /**
//    * @cfg {@observable any} Response type of data.
//    */
//   data?: Response;
//   /**
//    * @cfg {@observable bool} Loading state.
//    * Default to false.
//    */
//   loading?: boolean;
// }

export interface SMStoreRequestSet<Body> {
  url?: string;
  body?: Body;
  mapping?: string;
  persist?: boolean;
}

export interface SMStorePassword {
  password?: string;
}

export interface SMStoreError {
  statusCode?: number;
  message: string;
}
