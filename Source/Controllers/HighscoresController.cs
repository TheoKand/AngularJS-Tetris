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

        // GET api/<controller>
        /// <summary>
        /// Returns the list of highscores
        /// </summary>
        public List<Models.Highscores> Get()
        {
            using (Models.AngularContext db = new Models.AngularContext("AngularTetrisDB"))
            {
                var result = db.Highscores.OrderByDescending(h => h.Score).ToList();
                return result;
            }

        }

        /// <summary>
        /// Adds a new highscore to the database
        /// </summary>
        /// <param name="newItem"></param>
        [HttpPost]
        public void Put(Models.Highscores newItem)
        {
            using (Models.AngularContext db = new Models.AngularContext("AngularTetrisDB"))
            {
                if (newItem.Score > 200000) throw new Exception("No way!!! ;)");

                //add new highscore
                newItem.DateCreated = DateTime.Now;
                db.Highscores.Add(newItem);

                //delete lower highscore if there are more than 10
                if (db.Highscores.Count() > 9)
                {
                    var lowest = db.Highscores.OrderBy(h => h.Score).First();
                    db.Highscores.Remove(lowest);
                    db.Entry(lowest).State = System.Data.Entity.EntityState.Deleted;
                }

                //persist changes with entity framework
                db.SaveChanges();
            }

        }


    }
}