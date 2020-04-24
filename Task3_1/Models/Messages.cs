using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Task3_1.Models
{
    public partial class Message
    {
        public int id { get; set; }
        public string username { get; set; }
        public string message { get; set; }
        public Nullable<System.DateTime> timemes { get; set; }
    }

}
