import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { isPointInPolygon, isPointWithinRadius } from 'geolib';
import { ObjectId } from 'mongodb';
import { database_connection } from '../db';
import { RegionsService } from '../regions/regions.service';

@Injectable()
export class QuotesService {
  constructor(private regionService: RegionsService) {}

  async getQuotationPartners(id: string): Promise<any | undefined> {
    try {
      const collections = await database_connection(['Request', 'Partner']);
      if (!collections) {
        return;
      }
      const requestCollection = collections[0];
      console.log(id);
      const quotes = await requestCollection.findOne(
        { _id: new ObjectId(id) },
        { projection: { availablePartners: 1 } },
      );

      const partnerCollection = collections[1];

      let projectionObj = {
        _id: 1,
        email: 1,
        removalType: 1,
        areaPreference: 1,
        companyName: 1,
        businessType: 1,
        noOfEmployees: 1,
        telephone: 1,
        addressLine1: 1,
        city: 1,
        state: 1,
        salutation: 1,
        firstName: 1,
        lastName: 1,
        userName: 1,
        location: 1,
        radius: 1,
        EIN: 1,
        regions: 1,
        profileImage: 1,
      };

      if (!quotes?.availablePartners) {
        return [];
      }

      console.log(quotes);

      const partners = partnerCollection
        .find(
          { email: { $in: quotes?.availablePartners } },
          { projection: projectionObj },
        )
        .toArray();

      return partners;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }


    async getWeeklyQuotes(): Promise<any | undefined> {
        try {
            const collections = await database_connection(["Request"])
            if (!collections) {
                return
            }
            const requestCollection = collections[0]
            const quotes = requestCollection.aggregate([
                {
                    $match: {
                        requestTime: {
                            $gte: new Date(new Date().getTime() - (10 * 7 * 24 * 60 * 60 * 4000)) // 10 weeks ago
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dateToString: { format: "%Y-%U", date: "$requestTime" } // Grouping by year and week
                        },
//                        count: { $sum: 1 }, // Counting documents in each group
                        maxBudgetRangeSum: { $sum: "$maxBudgetRange" } // Summing maxBudgetRange
                    }
                },
                {
                    $sort: { "_id": -1 } // Sorting by week, newest first
                }
            ]).toArray()
                ;
            return quotes


        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }






    async getRecent5Requests(query: any): Promise<any | undefined> {
        try {
            let sortObj: any = { requestTime: -1 }
            if (query?.maxBudget === "true") {
                sortObj.maxBudgetRange = 1
            }
            console.log(sortObj, query?.maxBudget)
            const collections = await database_connection(["Request"])
            if (!collections) {
                return
            }
            const requestCollection = collections[0]
            const quotes = requestCollection
                .find({})
                .limit(5)
                .sort(sortObj)
                .toArray()

            return quotes


        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException()
        }
    }
  

  async postRequest(data: any) {
    try {
      const collections = await database_connection(['Request']);
      if (!collections) {
        throw new InternalServerErrorException();
      }
      const requestCollection = collections[0];

      const result = await requestCollection.insertOne(data);

      return result;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async getOnePartnerById(id: string) {
    try {
      const collections = await database_connection(['Request']);
      if (!collections) {
        throw new InternalServerErrorException();
      }
      const requestCollection = collections[0];

      const result = await requestCollection.findOne({ _id: new ObjectId(id) });

      return result;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async getAllRequest(setNo: number, projectObj: any, searchQuery: string) {
    try {
      let limit = 10;
      let skip = (setNo - 1) * limit;

      const collections = await database_connection(['Request']);
      if (!collections) {
        throw new InternalServerErrorException();
      }
      const requestCollection = collections[0];

      const [result, totalCount] = await Promise.all([
        requestCollection
          .aggregate([
            {
              $match: {
                $or: [
                  { name: { $regex: searchQuery } },
                  { moveFrom: { $regex: searchQuery } },
                  { moveTo: { $regex: searchQuery } },
                  { email: { $regex: searchQuery } },
                ],
              },
            },
            { $project: projectObj },
            { $sort: { requestTime: -1 } },
            { $skip: skip },
            { $limit: limit },
          ])
          .toArray(),
        requestCollection.countDocuments({}),
      ]);

      return { result, totalCount };
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async updateRequest(id: string, body: any): Promise<any | undefined> {
    try {
      const collections = await database_connection(['Request']);
      if (!collections) {
        return;
      }
      const requestCollection = collections[0];
      const result = requestCollection.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: body,
        },
      );
      return result;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async getRequestByEmail(email: string, setNo: number) {
    try {
      let limit = 10;
      let skip = (setNo - 1) * limit;

      const collections = await database_connection(['Request']);
      if (!collections) {
        throw new InternalServerErrorException();
      }
      const requestCollection = collections[0];

      const result = await requestCollection
        .aggregate([
          { $match: { email: email } },
          { $sort: { requestTime: -1 } },
          { $skip: skip },
          { $limit: limit },
        ])
        .toArray();

      return result;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  arePointsInsideAnyPolygon(point1: any, point2: any, polygons: any[]) {
    let isPoint1Inside = false;
    let isPoint2Inside = false;
    for (const polygon of polygons) {
      const coordinates = polygon.map((coord: any) => {
        return { latitude: coord.lat, longitude: coord.lng };
      });
      if (isPointInPolygon(point1, coordinates)) {
        isPoint1Inside = true;
      }
      if (isPointInPolygon(point2, coordinates)) {
        isPoint2Inside = true;
      }
      if (isPoint1Inside && isPoint2Inside) {
        return {
          isPoint1Inside,
          isPoint2Inside,
        };
      }
    }
    return {
      isPoint1Inside,
      isPoint2Inside,
    };
  }

  async getPartnerEmails(
    fromLat: number,
    fromLng: number,
    toLat: number,
    toLng: number,
  ) {
    try {
      const collections = await database_connection(['Partner']);
      if (!collections) {
        throw new InternalServerErrorException();
      }
      const partnerCollection = collections[0];

      const requiredRegions: any = [];
      let point1 = {
        latitude: fromLat,
        longitude: fromLng,
      };
      let point2 = {
        latitude: toLat,
        longitude: toLng,
      };
      let isPoint1Inside = false;
      let isPoint2Inside = false;

      const regions = [
        'Ajman',
        'Dubai',
        'Fujairah',
        'RasAl-Khaimah',
        'Sharjah',
        'Ummal-Qaywayn',
        'AbuDhabi',
      ];
      const polygons = await this.regionService.getPolygon(regions);

      polygons.forEach((polygon: any) => {
        if (!isPoint1Inside || !isPoint2Inside) {
          const result = this.arePointsInsideAnyPolygon(
            point1,
            point2,
            polygon.multiPolygon,
          );

          if (result.isPoint1Inside || result.isPoint2Inside) {
            requiredRegions.push(polygon.name);
          }
          if (result.isPoint1Inside) {
            isPoint1Inside = true;
          }
          if (result.isPoint2Inside) {
            isPoint2Inside = true;
          }
        }
      });

      const partners = await partnerCollection.find({}).toArray();

      let emails: any[] = [];
      await Promise.all(
        partners.map(async (partner: any) => {
          if (partner?.areaPreference === 'region') {
            let push = true;
            const partnerRegions = partner?.regions?.map(
              (reg: any) => reg.name,
            );
            requiredRegions.forEach((region: any) => {
              if (!partnerRegions.includes(region)) {
                push = false;
              }
            });
            if (push) {
              emails.push({
                email: partner.email,
                companyName: partner.companyName,
              });
            }
          } else if (partner.areaPreference === 'radius') {
            const latLng = await this.regionService.getLatLng(partner.location);
            const isPointOneInRadius = isPointWithinRadius(
              { latitude: fromLat, longitude: fromLng },
              { latitude: latLng?.lat, longitude: latLng?.lng },
              partner.radius * 1609.34,
            );
            const isPointTwoInRadius = isPointWithinRadius(
              { latitude: toLat, longitude: toLng },
              { latitude: latLng?.lat, longitude: latLng?.lng },
              partner.radius * 1609.34,
            );
            if (isPointTwoInRadius && isPointOneInRadius) {
              emails.push({
                email: partner.email,
                companyName: partner.companyName,
              });
            }
          }
        }),
      );

      return emails;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async getMaxBudgetQuotes() {
    try {
      const collections = await database_connection(['Request']);
      if (!collections) {
        throw new InternalServerErrorException();
      }
      const requestCollection = collections[0];
      const quotes = requestCollection
        .find({})
        .sort({ maxBudgetRange: -1 })
        .limit(5)
        .toArray();

      return quotes;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
