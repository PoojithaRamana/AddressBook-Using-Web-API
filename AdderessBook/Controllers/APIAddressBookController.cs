using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

using AddressBookModels;
using AddressBook;
using System.Web.Http;

namespace AddressBook.Controllers
{
    public class AddressBookController : ApiController
    {
        public List<Contact> GetContacts()
        {
            return MvcApplication.addressBook.GetAllContacts();
        }

        public Contact Get([FromUri]int id)
        {
            return MvcApplication.addressBook.GetContactById(id);           
        }

        public IHttpActionResult Post([FromBody]Contact contact)
        {
            contact.Id = MvcApplication.addressBook.InsertContact(contact);
            return Ok(contact);       
        }
         
        public IHttpActionResult Put([FromBody]Contact contact)
        {
            contact.Id = MvcApplication.addressBook.UpdateContact(contact);
            return Ok(contact);
        } 
        
        public IHttpActionResult Delete([FromUri]int id)
        {
            MvcApplication.addressBook.DeleteContact(id);
            return Ok();         
        }
    }
}