import {
    AddCustomerToOrderController,
    GetOrderByBookingIdController,
    PayOrderController,
} from '@/Infrastructure/WebApi/Controllers/mod.ts';
import { type Router, RouterBuilder, type Routes } from '@/Infrastructure/WebApi/Shared/mod.ts';

export class WebApiRoutes implements Routes {
    map(routerBuilder: RouterBuilder): Router {
        return routerBuilder
            .mapPost(AddCustomerToOrderController.name, '/api/orders/:orderId/customer')
            .mapGet(GetOrderByBookingIdController.name, '/api/orders/:bookingId')
            .mapPost(PayOrderController.name, '/api/orders/:orderId/payments')
            .build();
    }
}
