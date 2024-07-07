using FluentValidation;
using Handy.Data;
using Handy.Entities;
using Handy.Models;

namespace Handy.Api.Data.Validators
{
    public class LoginUserValidator : AbstractValidator<LoginDto>
    {
        public LoginUserValidator(AppDbContext db)
        {
            RuleFor(x => x.Email)
                .Custom((value, context) =>
                {
                    var emailInUse = db.Users.Any(u => u.Email == value);
                    if (!emailInUse)
                    {
                        context.AddFailure("Email", "Account with this Email does not exist");
                    }
                });
        }
    }
}
