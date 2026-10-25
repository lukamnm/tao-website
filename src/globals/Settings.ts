import type { GlobalConfig } from 'payload'
import { revalidateGlobal } from '@/lib/revalidate'

export const Settings: GlobalConfig = {
  slug: 'settings',
  label: 'პარამეტრები',
  admin: { group: 'სისტემა', description: 'კონტაქტები, პორტალის ბმულები, სოციალური ქსელები და სტატისტიკა.' },
  access: { read: () => true },
  hooks: { afterChange: [revalidateGlobal] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'კონტაქტი',
          fields: [
            { name: 'phone', type: 'text', label: 'ტელეფონი (ჩვენება)', defaultValue: '+995 32 280 10 01' },
            { name: 'phoneHref', type: 'text', label: 'ტელეფონი (tel:)', defaultValue: '+995322801001' },
            { name: 'email', type: 'email', label: 'ელფოსტა', defaultValue: 'info@taoinsurance.ge' },
            { name: 'address', type: 'text', label: 'მისამართი', localized: true, defaultValue: 'ანა პოლიტკოვსკაიას ქ. 16, 0186 თბილისი' },
            { name: 'addressShort', type: 'text', label: 'მისამართი (მოკლე)', localized: true, defaultValue: 'ანა პოლიტკოვსკაიას ქ. 16' },
            { name: 'city', type: 'text', label: 'ქალაქი და ინდექსი', localized: true, defaultValue: '0186 თბილისი' },
            { name: 'hours', type: 'text', label: 'სამუშაო საათები', localized: true, defaultValue: 'ორშ-პარ, 10:00-18:00' },
            { name: 'mapUrl', type: 'text', label: 'რუკის ბმული (Google Maps)' },
          ],
        },
        {
          label: 'პორტალი',
          fields: [
            { name: 'portalUrl', type: 'text', label: 'ტაოს პორტალი (URL)', defaultValue: 'https://portal.taoinsurance.ge' },
            { name: 'portalHealthUrl', type: 'text', label: 'ჯანმრთელობის დაზღვევის ყიდვა (URL)' },
            { name: 'portalTravelUrl', type: 'text', label: 'სამოგზაურო დაზღვევის ყიდვა (URL)' },
            { name: 'portalCarUrl', type: 'text', label: 'ავტოდაზღვევის ყიდვა (URL)' },
            { name: 'portalPropertyUrl', type: 'text', label: 'ქონების დაზღვევის ყიდვა (URL)' },
            { name: 'portalClaimUrl', type: 'text', label: 'ანაზღაურების მოთხოვნა (URL)' },
          ],
        },
        {
          label: 'სოციალური ქსელები',
          fields: [
            { name: 'facebook', type: 'text', label: 'Facebook' },
            { name: 'instagram', type: 'text', label: 'Instagram' },
            { name: 'linkedin', type: 'text', label: 'LinkedIn' },
          ],
        },
        {
          label: 'სტატისტიკა (ჩვენ შესახებ)',
          fields: [
            { name: 'foundedYear', type: 'text', label: 'ბაზარზე (წელი)', defaultValue: '2007' },
            { name: 'clients', type: 'text', label: 'დაზღვეული მომხმარებელი', defaultValue: '[N]+' },
            { name: 'paid', type: 'text', label: 'ანაზღაურებული თანხა', defaultValue: '[N] ₾ M' },
            { name: 'corporate', type: 'text', label: 'კორპორატიული კლიენტი', defaultValue: '[N]+' },
          ],
        },
        {
          label: 'SEO',
          fields: [
            { name: 'siteName', type: 'text', label: 'საიტის სახელი', localized: true, defaultValue: 'ტაო დაზღვევა' },
            { name: 'siteDescription', type: 'textarea', label: 'საიტის აღწერა', localized: true, defaultValue: 'ჯანმრთელობის და სამოგზაურო დაზღვევა 2007 წლიდან. პოლისი ონლაინ, ანაზღაურება სწრაფად.' },
            { name: 'ogImage', type: 'upload', relationTo: 'media', label: 'გაზიარების სურათი (OG)' },
          ],
        },
      ],
    },
  ],
}
