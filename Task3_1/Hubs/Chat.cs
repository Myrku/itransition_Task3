using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Task3_1.Models;

namespace Task3_1.Hubs
{
    public class Chat:Hub
    {
        public void BroadcastMessage(string name, string message)
        {
            using (MessageContext messageContext = new MessageContext())
            {
                messageContext.Messages.Add(new Message { username = name, message = message, timemes = DateTime.Now });
                messageContext.SaveChanges();
            }
            Clients.All.SendAsync("broadcastMessage", name, message); 
        }
    }
}
