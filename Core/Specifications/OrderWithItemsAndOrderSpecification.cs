using System.Linq.Expressions;
using Core.Entities.OrderAggregate;

namespace Core.Specifications
{
    public class OrderWithItemsAndOrderSpecification : BaseSpecification<Order>
    {
        public OrderWithItemsAndOrderSpecification(string email) : base(o => o.BuyerEmail == email) 
        {
            AddInclude(o => o.OrderItems);
            AddInclude(o => o.DeliveryMethod);
            AddOrderByDescending(o => o.OrderDate);
        }

        public OrderWithItemsAndOrderSpecification(int id, string email) : base(o => o.Id == id && o.BuyerEmail == email)
        {
            AddInclude(o => o.OrderItems);
            AddInclude(o => o.DeliveryMethod);
        }
    }
}