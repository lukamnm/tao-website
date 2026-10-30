import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '@/lib/revalidate'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'საიტის პარამეტრები',
  admin: {
    group: 'სისტემა',
    description: 'ტელეფონი, მისამართი, პორტალის ბმული, სოციალური ქსელები და ციფრები "ჩვენ შესახებ" გვერდზე. ცვლილება საიტზე მაშინვე ჩანს.',
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
                { name: 'phone', type: 'text', label: 'ტელეფონი', defaultValue: '+995 32 280 10 01', admin: { width: '50%' } },
                { name: 'email', type: 'email', label: 'ელფოსტა', defaultValue: 'info@taoinsurance.ge', admin: { width: '50%' } },
              ],
            },
            { name: 'phoneHref', type: 'text', defaultValue: '+995322801001', admin: { hidden: true } },
            { name: 'address', type: 'text', label: 'სრული მისამართი', localized: true, defaultValue: 'ანა პოლიტკოვსკაიას ქ. 16, 0186 თბილისი' },
            {
              type: 'row',
              fields: [
                { name: 'addressShort', type: 'text', label: 'ქუჩა და ნომერი', localized: true, defaultValue: 'ანა პოლიტკოვსკაიას ქ. 16', admin: { width: '50%' } },
                { name: 'city', type: 'text', label: 'ინდექსი და ქალაქი', localized: true, defaultValue: '0186 თბილისი', admin: { width: '50%' } },
              ],
            },
            { name: 'hours', type: 'text', label: 'სამუშაო საათები', localized: true, defaultValue: 'ორშ-პარ, 10:00-18:00' },
            { name: 'mapUrl', type: 'text', label: 'Google Maps-ის ბმული', admin: { description: 'Google Maps-ში იპოვე ოფისი, დააჭირე "გაზიარება" და ბმული აქ ჩასვი.' } },
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
          label: 'სოციალური ქსელები',
          fields: [
            { name: 'facebook', type: 'text', label: 'Facebook', admin: { placeholder: 'https://facebook.com/...' } },
            { name: 'instagram', type: 'text', label: 'Instagram', admin: { placeholder: 'https://instagram.com/...' } },
            { name: 'linkedin', type: 'text', label: 'LinkedIn', admin: { placeholder: 'https://linkedin.com/company/...' } },
          ],
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
