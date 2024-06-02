# vt-karta

En karta som låter en pricka av vilka hållplatser i Göteborgs stad en har besökt.
Besökta hållplatser sparas i local storage, och rensas därmed om en rensar kakor i webbläsaren.

Kartan laddar inte dynamiskt hållplatser, utan datan ligger hårdkodad i `src/assets`.

## För att köra

```
npm install
npm run dev
```

Därefter öppna http://localhost:1337. Klicka i tooltipet för en hållplats för att bocka av den.
