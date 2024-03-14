import { Injectable } from '@nestjs/common';
import { database_connection } from '../db';
const NodeGeocoder = require('node-geocoder');

@Injectable()
export class RegionsService {


    async getLatLng(place: string) {
        try {

            const options = {
                provider: 'google',
                apiKey: 'AIzaSyBmlfCX9N5NAKdGidMbSxMXkc4CNHcT6rQ', 
            };

            const geocoder = NodeGeocoder(options);

            const res = await geocoder.geocode(place);
            if (res.length === 0) {
                return null
            }
            return { lat: res[0].latitude, lng: res[0].longitude }
        } catch (error) {
            console.error('Error fetching location coordinates:', error);
            throw error;
        }
    }


    async getPolygon(namesArr: string[]) {
        try {
            const collections = await database_connection(["Regions"])
            if (!collections) {
                return
            }
            const regionCollection = collections[0]
            const result = await regionCollection.find({ name: { $in: namesArr } }).toArray()
            return result
        } catch (e) {
            console.log(e)
        }
    }

    async getAllRegions() {
        try {
            const collections = await database_connection(["Regions"])
            if (!collections) {
                return
            }
            const regionCollection = collections[0]
            const result = await regionCollection.find({}).project({ name: 1 }).toArray()
            return result
        } catch (e) {
            console.log(e)
        }
    }


}
