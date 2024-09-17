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

        public virtual DbSet<Produits> Produits { get; set; }

   
}}
