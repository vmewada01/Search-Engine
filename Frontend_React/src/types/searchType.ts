export interface LogResponse {
    limit: number;
    logs: LogEntry[];
    page: number;
    total: number;
    totalPages: number;
  }
  
  export interface LogEntry {
    Message: string;
    MessageRaw: MessageRaw;
    StructuredData: StructuredData;
    Tag: string;
    Sender: string;
    Groupings: string;
    Event: string;
    EventId: string;
    NanoTimeStamp: string;
    Namespace: string;
  }
  
  export interface MessageRaw {
    cluster_id: string;
    date: number;
    host: string;
    kubernetes: Kubernetes;
    log: string;
    namespace: string;
  }
  
  export interface Kubernetes {
    container_image: string;
    container_name: string;
    docker_id: string;
    host: string;
    labels: KubernetesLabels;
    namespace_name: string;
    pod_id: string;
    pod_name: string;
  }
  
  export interface KubernetesLabels {
    "app.kubernetes.io/component": string;
    "app.kubernetes.io/instance": string;
    "app.kubernetes.io/name": string;
    "opentelemetry.io/name": string;
    "pod-template-hash": string;
  }
  
  export interface StructuredData {
    _psid: string[];
    _size: string[];
    date: string[];
    "kubernetes.container_image": string[];
    "kubernetes.container_name": string[];
    "kubernetes.docker_id": string[];
    "kubernetes.host": string[];
    "kubernetes.labels.app.kubernetes.io/component": string[];
    "kubernetes.labels.app.kubernetes.io/instance": string[];
    "kubernetes.labels.app.kubernetes.io/name": string[];
    "kubernetes.labels.opentelemetry.io/name": string[];
    "kubernetes.labels.pod-template-hash": string[];
    "kubernetes.namespace_name": string[];
    "kubernetes.pod_id": string[];
    "kubernetes.pod_name": string[];
    psid: string[];
  }
  

  export interface SearchingFilters {
    page: number;
    limit: number;
    query: string;
  }
  export interface LoadingMap {
    isDeletingTemplateParam: string | null;
    isAddingTemplateParam: boolean;
    isAddingTemplate: boolean;
    isDeletingTemplate: string | null;
  }