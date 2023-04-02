using API.Errors;
using Core.Entities;
using Core.Entities.OrderAggregate;
using Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Stripe;

namespace API.Controllers
{
    public class PaymentsController : BaseApiController
    {
        private const string WhSecret = "whsec_d0bc296dc7a57137af6663deaaf62c2de7b862c49b8c17ba5184d4ee3893d078";
        private readonly IPaymentService _paymentService;
        private readonly ILogger<PaymentsController> _logger;
        public PaymentsController(IPaymentService paymentService, ILogger<PaymentsController> logger)
        {
            _logger = logger;
            _paymentService = paymentService;
        }

        [Authorize]
        [HttpPost("{basketId}")]
        public async Task<ActionResult<CustomerBasket>> CreateOrUpdatePaymentIntent(string basketId) 
        {
            var basket = await _paymentService.CreateOrUpdatePaymentIntent(basketId);    

            if(basket == null) return BadRequest(new ApiResponse(400, "Problem with your basket"));

            return basket;
        }

        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWebhook() 
        {
            var json = await new StreamReader(Request.Body).ReadToEndAsync();
            var stripeEvent = EventUtility.ConstructEvent(json, 
                Request.Headers["Stripe-Signature"], WhSecret);

            PaymentIntent intent;
            Order order;

            switch (stripeEvent.Type)
            {
                case "payment_intent.succeeded": 
                    intent = (PaymentIntent) stripeEvent.Data.Object;
                    _logger.LogInformation("Payment succeeded: ", intent.Id);
                    // TODO: update order with a new status
                    order = await _paymentService.UpdateOrderPaymentSucceeded(intent.Id);
                    _logger.LogInformation("Order updated for payment received: ", order.Id);
                    break;

                case "payment_intent.payment_failed": 
                    intent = (PaymentIntent) stripeEvent.Data.Object;
                    _logger.LogInformation("Payment failed: ", intent.Id);
                    // TODO: update order with a new status
                    order = await _paymentService.UpdateOrderPaymentFailed(intent.Id);
                    _logger.LogInformation("Order updated for payment failed: ", order.Id);
                    break;
            }

            return new EmptyResult();
        }
    }
}