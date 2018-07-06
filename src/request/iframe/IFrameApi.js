class IFrameApi {

    /**
     * @param {boolean} [listFromAccountStore] - Deprecated, used for migrating keys to new database
     */
    async list(listFromAccountStore) {

        if (BrowserDetection.isIos() || BrowserDetection.isSafari()) {
            return CookieJar.eat(listFromAccountStore);
        }

        if (listFromAccountStore) {
            return AccountStore.instance.list();
        }

        return KeyStore.instance.list();
    }

    /**
     * @deprecated Only for migrating databases during the transition period
     */
    async migrateAccountsToKeys() {
        if (BrowserDetection.isIos() || BrowserDetection.isSafari()) {
            // Set migrate flag cookie
            document.cookie = 'migrate=1;max-age=31536000';
            return true;
        }

        return KeyStore.instance.doMigrateAccountsToKeys();
    }
}

runKeyguard(IFrameApi, {
    loadNimiq: false,
    whitelist: [
        'list',
        'migrateAccountsToKeys'
    ]
});
