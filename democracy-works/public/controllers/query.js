const axios = require('axios');
const ErrorResponse = require('../../utils/errorResponse');

exports.upcoming = async (req, res, next) => {
    try {
        const street = req.body.street.toLowerCase().trim() || null;
        const street2 = req.body['street-2'].toLowerCase().trim() || null;
        const zip = req.body.zip.trim() || null;

        if (!req.body.city) return next(new ErrorResponse('Please provide city name', 400));
        if (!req.body.state) return next(new ErrorResponse('Please provide state name', 400));

        const state = req.body.state.toLowerCase();
        const place = req.body.city.toLowerCase().trim().split(' ').join('_');

        const stateOCDID = `ocd-division/country:us/state:${state}`;
        const placeOCDID = `${stateOCDID}/place:${place}`;
        const url = `https://api.turbovote.org/elections/upcoming?district-divisions=${stateOCDID},${placeOCDID}`;

        const result = await axios({
            method: 'get',
            url,
            headers: { Accept: 'application/json' }
        });

        if (!result.data.length) return res.render('no-result', { street, street2, state: req.body.state, city: req.body.city, zip });

        const { description, date, type } = result.data[0];
        const pullingPlaceUrl = result.data[0]['polling-place-url-shortened'];

        res.render('search', { street, street2, state: req.body.state, city: req.body.city, zip, description, date, type, pullingPlaceUrl });
    } catch (err) {
        next(err);
    }
};
