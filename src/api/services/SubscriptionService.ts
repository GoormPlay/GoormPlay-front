import { ApiClient } from "../ApiClient";
import { Subscription } from "../../types/Subscription";

class SubscriptionService {
    private apiClient: ApiClient;

    constructor(apiClient: ApiClient) {
        this.apiClient = apiClient;
    }
    
    async getSubscription() {
        return this.apiClient.get<Subscription>('SUBSCRIPTION');
      }
      async updateSubscription(data: any) {
        return this.apiClient.post('SUBSCRIPTION', data);
      }
}

export const subscriptionService = new SubscriptionService(ApiClient.getInstance());