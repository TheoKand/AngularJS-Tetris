using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace App.Controllers
{
    public class HighscoresController : ApiController
    {

        protected App.Models.oblivius_mysqlEntities db = new Models.oblivius_mysqlEntities();

        // GET api/<controller>
        /// <summary>
        /// Returns the list of highscores
        /// </summary>
        public List<Models.angulartetris_highscores> Get()
        {
            var result =  db.angulartetris_highscores.OrderByDescending(h => h.Score).ToList();
            return result;
        }

        /// <summary>
        /// Adds a new highscore to the database
        /// </summary>
        /// <param name="newItem"></param>
        [HttpPost]
        public void Put(Models.angulartetris_highscores newItem)
        {
            //add new highscore
            newItem.DateCreated = DateTime.Now;
            db.angulartetris_highscores.Add(newItem);

            //delete lower highscore if there are more than 10
            if (db.angulartetris_highscores.Count()>9)
            {
                var lowest = db.angulartetris_highscores.OrderBy(h => h.Score).First();
                db.angulartetris_highscores.Remove(lowest);
                db.Entry(lowest).State = System.Data.Entity.EntityState.Deleted;
            }

            //persist changes with entity framework
            db.SaveChanges();

        }


    }
}