import "jest";
import TripService from "../src/trip/TripService";
import User from "../src/user/User";
import Trip from "../src/trip/Trip";
import UserNotLoggedInException from "../src/exception/UserNotLoggedInException";

const makeSut = () => {
  class TestableTripService extends TripService {
    public getLoggedUser(): any {
      return;
    }
    public findTripsByUser(user: User): any {
      return user.getTrips();
    }
  }
  const fakeTripService = new TestableTripService();

  return { fakeTripService };
};

describe("testing trip service", () => {
  it("should list trips of an user", () => {
    const { fakeTripService } = makeSut();
    const user1 = new User();
    const user2 = new User();
    const trip = new Trip();
    user1.addFriend(user2);
    user1.addTrip(trip);
    fakeTripService.getLoggedUser = jest.fn(() => user2);
    const trips = fakeTripService.getTripsByUser(user1);
    expect(trips).toEqual([trip]);
  });

  test("should throw an error if user is not logged in", () => {
    const { fakeTripService } = makeSut();
    const user1 = new User();
    const user2 = new User();
    user1.addFriend(user2);
    fakeTripService.getLoggedUser = jest.fn(() => null);
    expect(() => fakeTripService.getTripsByUser(user1)).toThrow(
      UserNotLoggedInException
    );
  });

  test("should not list trips because no one of the user friends is logged in", () => {
    const { fakeTripService } = makeSut();
    const user1 = new User();
    const user2 = new User();
    const user3 = new User();
    const trip = new Trip();
    user1.addFriend(user2);
    user1.addTrip(trip);
    fakeTripService.getLoggedUser = jest.fn(() => user3);
    const trips = fakeTripService.getTripsByUser(user1);
    expect(trips).toEqual([]);
  });

  test("should not list trips because user has no friends", () => {
    const { fakeTripService } = makeSut();
    const user1 = new User();
    const user2 = new User();
    const trip = new Trip();
    user1.addTrip(trip);
    fakeTripService.getLoggedUser = jest.fn(() => user2);
    const trips = fakeTripService.getTripsByUser(user1);
    expect(trips).toEqual([]);
  });
});
