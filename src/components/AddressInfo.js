/* global Address */
/* global Identicon */
/* global Nimiq */

class AddressInfo extends Nimiq.Observable { // eslint-disable-line no-unused-vars
    /**
     *
     * @param {{ userFriendlyAddress: string, label: string?, imageUrl: URL?, accountLabel: string?}} addressInfo
     * @param {HTMLElement} $el
     * @param {boolean} isDetailedView
     */
    constructor(addressInfo, $el, isDetailedView = false) {
        super();

        this._addressInfo = addressInfo;

        this.appendTo($el, isDetailedView);
    }

    /**
     *
     * @param {HTMLElement} $el
     * @param {boolean} isDetailedView
     */
    appendTo($el, isDetailedView = false) {
        $el = this._createElement($el, isDetailedView);
        if (!isDetailedView) {
            $el.addEventListener('click', event => {
                event.preventDefault(); // in case $el is a HTMLLinkElement
                this.fire(AddressInfo.Event.CLICKED, this._addressInfo);
            });
        }
    }

    /**
     * @private
     * @param {HTMLElement} $el
     * @param {boolean} isDetailedView
     * @returns {HTMLElement}
     */
    _createElement($el, isDetailedView) {
        $el = $el || document.createElement('a');
        $el.classList.toggle('addressInfo', true);

        const label = this._addressInfo.label || (isDetailedView
            ? 'Unnamed Contact'
            : this._addressInfo.userFriendlyAddress);

        const accountLabel = this._addressInfo.accountLabel && isDetailedView
            ? `
            <div class="account-label nq-label">${this._addressInfo.accountLabel}</div>`
            : '';

        $el.innerHTML = `
            <div class="identicon"></div>
            <div class="label">${label}</div>
            ${accountLabel}
            ${isDetailedView ? '<div class="address"></div>' : ''}
        `;

        /** @type {HTMLDivElement} */
        const $identicon = ($el.querySelector('.identicon'));
        if (this._addressInfo.imageUrl) { // URl is given, use image
            const $shopLogo = document.createElement('img');
            $shopLogo.src = this._addressInfo.imageUrl.href;
            $identicon.classList.add('clip');
            $identicon.appendChild($shopLogo);
            $shopLogo.addEventListener('error', () => {
                $shopLogo.remove();
                $identicon.classList.remove('clip');
                // eslint-disable-next-line no-new
                new Identicon(this._addressInfo.userFriendlyAddress, $identicon);
            });
        } else {
            // eslint-disable-next-line no-new
            new Identicon(this._addressInfo.userFriendlyAddress, $identicon);
        }

        if (isDetailedView) {
            // eslint-disable-next-line no-new
            new Address(/** @type {HTMLElement} */($el.querySelector('.address')),
                this._addressInfo.userFriendlyAddress);
        }

        return $el;
    }
}

AddressInfo.Event = {
    CLICKED: 'clicked',
};
