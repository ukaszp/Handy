export interface OfferRequest {
    taskId: number;
    handymanId: number;
    price?: number;
    estimatedTime?: string;
    comment: string;
  }