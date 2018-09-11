using AddressBookModels;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AddressBookServices
{
    public static class AutoMapper
    {
        public static MapperConfiguration config = new MapperConfiguration(cfg =>{
            cfg.CreateMap<Contact, DbContact.Contact>();
        });
        public static readonly IMapper mapper = config.CreateMapper();

        public static List<T1> MapperCollection<T1,T2>(List<T2> contactsDB)
        {
            List<T1> contacts = new List<T1>();
            foreach (T2 contact in contactsDB)
            {
                T1 cont = mapper.Map<T2, T1>(contact);
                contacts.Add(cont);
            }
            return contacts;
        }
    }
}
