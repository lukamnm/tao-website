import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '@/lib/revalidate'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'საიტის პარამეტრები',
  admin: {
    group: 'სისტემა',
    description: 'ტელეფონი, ოფისის და სერვის ცენტრის მისამართი, პორტალის ბმული, Facebook და ციფრები "ჩვენ შესახებ" გვერდზე. ცვლილება საიტზე მაშინვე ჩანს.',
  },
  access: { read: () => true },
  hooks: {
    afterChange: [revalidateGlobal],
    // The dialable number (tel:) is made from the displayed one, so nobody has to type it twice.
    beforeChange: [({ data }) => ({ ...data, phoneHref: typeof data?.phone === 'string' ? '+' + data.phone.replace(/\D/g, '') : data?.phoneHref })],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'კონტაქტი',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'phone', type: 'text', label: 'ტელეფონი', defaultValue: '+995 32 219 52 12', admin: { width: '50%' } },
                { name: 'email', type: 'email', label: 'ელფოსტა', defaultValue: 'contact@taoinsurance.ge', admin: { width: '50%' } },
              ],
            },
            { name: 'phoneHref', type: 'text', defaultValue: '+995322195212', admin: { hidden: true } },
            { name: 'address', type: 'text', label: 'ოფისის სრული მისამართი', localized: true, defaultValue: 'ანა პოლიტკოვსკაიას ქ. 16, 0186 თბილისი' },
            {
              type: 'row',
              fields: [
                { name: 'addressShort', type: 'text', label: 'ქუჩა და ნომერი', localized: true, defaultValue: 'ანა პოლიტკოვსკაიას ქ. 16', admin: { width: '50%' } },
                { name: 'city', type: 'text', label: 'ინდექსი და ქალაქი', localized: true, defaultValue: '0186 თბილისი', admin: { width: '50%' } },
              ],
            },
            { name: 'hours', type: 'text', label: 'სამუშაო საათები', localized: true, defaultValue: 'ორშ-პარ, 10:00-18:00' },
            { name: 'mapUrl', type: 'text', label: 'ოფისი Google Maps-ზე', admin: { description: 'Google Maps-ში იპოვე ოფისი, დააჭირე "გაზიარება" და ბმული აქ ჩასვი.' } },
          ],
        },
        {
          label: 'სერვის ცენტრი',
          description: 'ჩანს კონტაქტის გვერდზე და ყველა გვერდის ქვედა ნაწილში.',
          fields: [
            { name: 'serviceAddress', type: 'text', label: 'სრული მისამართი', localized: true, defaultValue: 'შალვა ნუცუბიძის ქ. 72, 0186 თბილისი' },
            {
              type: 'row',
              fields: [
                { name: 'serviceAddressShort', type: 'text', label: 'ქუჩა და ნომერი', localized: true, defaultValue: 'შალვა ნუცუბიძის ქ. 72', admin: { width: '50%' } },
                { name: 'serviceCity', type: 'text', label: 'ინდექსი და ქალაქი', localized: true, defaultValue: '0186 თბილისი', admin: { width: '50%' } },
              ],
            },
            {
              name: 'serviceHours',
              type: 'array',
              label: 'სამუშაო საათები',
              labels: { singular: 'სტრიქონი', plural: 'სტრიქონები' },
              admin: { description: 'თითო სტრიქონი: დღეები და საათები. მაგ: "ორშაბათი - პარასკევი" და "9:00 - 18:00".' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'days', type: 'text', label: 'დღეები', localized: true, required: true, admin: { width: '60%' } },
                    { name: 'time', type: 'text', label: 'საათები', required: true, admin: { width: '40%' } },
                  ],
                },
              ],
            },
            { name: 'serviceMapUrl', type: 'text', label: 'სერვის ცენტრი Google Maps-ზე', admin: { description: 'Google Maps-ში იპოვე სერვის ცენტრი, დააჭირე "გაზიარება" და ბმული აქ ჩასვი.' } },
          ],
        },
        {
          label: 'პორტალი',
          description: 'კონკრეტული პროდუქტის ყიდვის ბმული იწერება თავად პროდუქტში (კატეგორიები → პროდუქტები).',
          fields: [
            { name: 'portalUrl', type: 'text', label: 'ტაოს პორტალი', defaultValue: 'https://portal.taoinsurance.ge', admin: { description: '"ჩემი პროფილი" ღილაკი ამ მისამართზე გადადის.' } },
            { name: 'portalClaimUrl', type: 'text', label: 'ანაზღაურების მოთხოვნა პორტალზე', admin: { description: 'თუ ცარიელია, პორტალის მთავარი გვერდი გაიხსნება.' } },
          ],
        },
        {
          label: 'Facebook',
          fields: [{ name: 'facebook', type: 'text', label: 'Facebook-ის გვერდი', admin: { placeholder: 'https://facebook.com/...' } }],
        },
        {
          label: 'ციფრები',
          description: 'ოთხი დიდი ციფრი "ჩვენ შესახებ" გვერდზე.',
          fields: [
            {
              type: 'row',
              fields: [
                { name: 'foundedYear', type: 'text', label: 'ბაზარზე (წლიდან)', defaultValue: '2007', admin: { width: '25%' } },
                { name: 'clients', type: 'text', label: 'დაზღვეული მომხმარებელი', defaultValue: '[N]+', admin: { width: '25%', placeholder: '50 000+' } },
                { name: 'paid', type: 'text', label: 'ანაზღაურებული თანხა', defaultValue: '[N] ₾ M', admin: { width: '25%', placeholder: '12 ₾ M' } },
                { name: 'corporate', type: 'text', label: 'კორპორატიული კლიენტი', defaultValue: '[N]+', admin: { width: '25%', placeholder: '300+' } },
              ],
            },
          ],
        },
        {
          label: 'Google და გაზიარება',
          description: 'როგორ ჩანს საიტი Google-ში და Facebook-ზე გაზიარებისას.',
          fields: [
            { name: 'siteName', type: 'text', label: 'საიტის სახელი', localized: true, defaultValue: 'ტაო დაზღვევა' },
            { name: 'siteDescription', type: 'textarea', label: 'საიტის მოკლე აღწერა', localized: true, defaultValue: 'ჯანმრთელობის და სამოგზაურო დაზღვევა 2007 წლიდან. პოლისი ონლაინ, ანაზღაურება სწრაფად.' },
            { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'გაზიარების ფოტო', admin: { description: 'ჩანს, როცა საიტის ბმულს ვინმე Facebook-ზე ან Messenger-ში აზიარებს.' } },
          ],
        },
      ],
    },
  ],
}
