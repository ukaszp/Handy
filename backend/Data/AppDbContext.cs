using Handy.Api.Entities;
using Handy.Entities;
using Handy.Entities;
using Microsoft.EntityFrameworkCore;

namespace Handy.Data
{
    public class AppDbContext:DbContext 
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>()
           .Property(u => u.Name)
           .IsRequired()
           .HasMaxLength(25);

            modelBuilder.Entity<Role>()
             .Property(u => u.Name)
             .IsRequired()
             .HasMaxLength(25);

            modelBuilder.Entity<Role>()
             .Property(r => r.Id)
             .ValueGeneratedNever();

            //DB
            modelBuilder.Entity<HandymanInfo>()
              .HasOne(h => h.User)
              .WithOne()
              .HasForeignKey<HandymanInfo>(h => h.Id);

            modelBuilder.Entity<HandymanInfo>()
                .HasMany(h => h.Skills)
                .WithMany(s => s.HandymanInfos)
                .UsingEntity(j => j.ToTable("HandymanInfoSkill"));

            modelBuilder.Entity<HandymanInfo>()
                .HasOne(h => h.Region)
                .WithMany(r => r.Handymaninfos)
                .HasForeignKey(h => h.RegionId);

            modelBuilder.Entity<HandymanInfo>()
                .HasMany(h => h.Ratings)
                .WithOne(r => r.Handyman)
                .HasForeignKey(r => r.HandymanId);

            modelBuilder.Entity<Offer>()
                .HasOne(o => o.Task)
                .WithMany(t => t.Offers)
                .HasForeignKey(o => o.TaskId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Offer>()
                .HasOne(o => o.Handyman)
                .WithMany()
                .HasForeignKey(o => o.HandymanId);


            modelBuilder.Entity<Rating>()
                .HasOne(r => r.Handyman)
                .WithMany(h => h.Ratings)
                .HasForeignKey(r => r.HandymanId);

            modelBuilder.Entity<Rating>()
                .HasMany(r => r.ratingResponds)
                .WithOne()
                .HasForeignKey(rr => rr.RatingId);


            modelBuilder.Entity<Region>()
                .HasMany(r => r.Handymaninfos)
                .WithOne(h => h.Region)
                .HasForeignKey(h => h.RegionId);


            modelBuilder.Entity<Region>()
                .HasMany(r => r.Tasks)
                .WithOne(t => t.Region)
                .HasForeignKey(t => t.RegionId);


            modelBuilder.Entity<Skill>()
                .HasMany(s => s.HandymanInfos)
                .WithMany(h => h.Skills)
                .UsingEntity(j => j.ToTable("HandymanInfoSkill"))
                .HasKey(t => t.Id);

            modelBuilder.Entity<Skill>()
                .HasMany(s => s.UserTasks)
                .WithMany(t => t.Skills)
                .UsingEntity(j => j.ToTable("UserTaskSkill"))
                .HasKey(t => t.Id);

            modelBuilder.Entity<UserClient>()
                .HasOne(uc => uc.User)
                .WithOne()
                .HasForeignKey<UserClient>(uc => uc.Id);

            modelBuilder.Entity<UserClient>()
                .HasMany(uc => uc.Tasks)
                .WithOne(t => t.Client)
                .HasForeignKey(t => t.ClientId);

            modelBuilder.Entity<UserTask>()
                .HasOne(ut => ut.Client)
                .WithMany(uc => uc.Tasks)
                .HasForeignKey(ut => ut.ClientId);

            modelBuilder.Entity<UserTask>()
                .HasMany(ut => ut.Photos)
                .WithOne();

            modelBuilder.Entity<UserTask>()
                .HasOne(ut => ut.Region)
                .WithMany(r => r.Tasks)
                .HasForeignKey(ut => ut.RegionId);

            modelBuilder.Entity<UserTask>()
                .HasMany(ut => ut.Skills)
                .WithMany(s => s.UserTasks)
                .UsingEntity(j => j.ToTable("UserTaskSkill"));

            modelBuilder.Entity<UserTask>()
                .HasMany(ut => ut.Offers)
                .WithOne(o => o.Task)
                .HasForeignKey(o => o.TaskId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Rating>()
                .HasOne(r => r.User)     
                .WithOne()                
                .HasForeignKey<Rating>(r => r.UserId)  
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Conflict>()
                .HasOne(r => r.Client)
                .WithOne()
                .HasForeignKey<Conflict>(r => r.ClientId)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Conflict>()
                .HasOne(r => r.Offer)
                .WithOne()
                .HasForeignKey<Conflict>(r => r.OfferId)
                .OnDelete(DeleteBehavior.NoAction);



        }
        public DbSet<Conflict> Conflicts { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<ChatMessage> ChatMessages { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<UserTask> Tasks {  get; set; } 
        public DbSet<Skill> Skills {  get; set; }
        public DbSet<Rating> Ratings {  get; set; }
        public DbSet<Offer> Offers {  get; set; } 
        public DbSet<HandymanInfo> HandymanInfos {  get; set; } 
        public DbSet<Region> Regions { get; set; }
        public DbSet<RatingRespond> RatingResponds { get; set; }
        public DbSet<UserClient> UserClients { get; set; }
        public DbSet<Photo> Photos { get; set; }
    }
}
