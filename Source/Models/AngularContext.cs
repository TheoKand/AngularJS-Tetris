using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace App.Models
{
    public class AngularContext : DbContext
    {
        public AngularContext(string connString)
        : base(connString)
        {
        }

        public DbSet<Highscores> Highscores { get; set; }
    }


}