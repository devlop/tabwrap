<p align="center">
    <a href="https://www.npmjs.org/package/@devlop/tabwrap"><img src="https://img.shields.io/npm/v/@devlop/tabwrap.svg" alt="Latest Stable Version"></a>
    <a href="https://github.com/devlop/tabwrap/blob/main/LICENSE.md"><img src="https://img.shields.io/badge/license-MIT-green" alt="License"></a>
</p>

# tabwrap

Minimalistic utility to add tab wrapping to any element, such as dialogs and popups.

# Installing

using npm

```bash
npm install @devlop/tabwrap
```

# Usage

```html
<div class="dialog">
    <input type="text"> <!-- switch + tab here should switch focus to the last <input> -->
    <input type="text">
    <input type="text"> <!-- tab here should switch focus to the first <input>-->
</template>
```

```javascript
import tabwrap from '@devlop/tabwrap';

tabwrap(document.querySelector('div.dialog'));
```

## Simplified usage on multiple elements

If you have many places you want to add tab wrapping it can usefull to give all your elements you wish to target
the same attribute, for example `data-tabwrap`, then it's easy to add tab wrapping to them all like this.

```javascript
import tabwrap from '@devlop/tabwrap';

document.querySelectorAll('[data-tabwrap]').forEach(function (element) {
    tabwrap(element);
});
```
