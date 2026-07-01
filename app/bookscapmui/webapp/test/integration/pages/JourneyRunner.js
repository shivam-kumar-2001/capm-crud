sap.ui.define([
    "sap/fe/test/JourneyRunner",
	"bookscapmui/test/integration/pages/BooksSetList",
	"bookscapmui/test/integration/pages/BooksSetObjectPage"
], function (JourneyRunner, BooksSetList, BooksSetObjectPage) {
    'use strict';

    var runner = new JourneyRunner({
        launchUrl: sap.ui.require.toUrl('bookscapmui') + '/test/flpSandbox.html#bookscapmui-tile',
        pages: {
			onTheBooksSetList: BooksSetList,
			onTheBooksSetObjectPage: BooksSetObjectPage
        },
        async: true
    });

    return runner;
});

