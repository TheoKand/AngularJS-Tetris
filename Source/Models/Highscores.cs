using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;



namespace App.Models
{
    using System;
    using System.Collections.Generic;

    public class Highscores
    {
        public int id { get; set; }
        public string Name { get; set; }
        public int Score { get; set; }
        public System.DateTime DateCreated { get; set; }
    }
}