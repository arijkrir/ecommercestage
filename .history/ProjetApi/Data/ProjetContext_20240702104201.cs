using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace ProjetApi.Models
{
    public partial class ProjetContext : DbContext
    {
        public ProjetContext()
        {
        }

        public ProjetContext(DbContextOptions<ProjetContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Produit> Produits { get; set; }

    //     protected override void OnModelCreating(ModelBuilder modelBuilder)
    //     {
    //         modelBuilder.Entity<Produit>(entity =>
    //         {
    //             entity.HasKey(e => e.Id);

    //             entity.Property(e => e.Reference)
    //                 .IsRequired()
    //                 .HasMaxLength(100);

    //             entity.Property(e => e.Designation)
    //                 .IsRequired()
    //                 .HasMaxLength(255);
    //         });

    //         OnModelCreatingPartial(modelBuilder);
    //     }

    //     partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    // }

    // public partial class Produit
    // {
    //     public int Id { get; set; }
    //     public string Reference { get; set; }
    //     public string Designation { get; set; }
    // }
}
