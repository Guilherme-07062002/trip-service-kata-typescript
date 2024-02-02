import UserNotLoggedInException from "../exception/UserNotLoggedInException";
import User from "../user/User";
import UserSession from "../user/UserSession";
import Trip from "./Trip";
import TripDAO from "./TripDAO";

export default class TripService {
  public getTripsByUser(user: User): Trip[] {
    const isAnyActiveFriend = this.checkActiveFriends(user);
    if (isAnyActiveFriend) {
      return this.findTripsByUser(user);
    }
    return [];
  }

  protected checkActiveFriends(user: User): boolean {
    const loggedUser: User = this.getLoggedUser();
    if (loggedUser == null) {
      throw new UserNotLoggedInException();
    }
    const userFriends = user.getFriends();
    for (const friend of userFriends) {
      if (friend === loggedUser) {
        return true;
      }
    }
  }

  protected getLoggedUser(): User | null {
    return UserSession.getLoggedUser();
  }

  protected findTripsByUser(user: User): Trip[] {
    return TripDAO.findTripsByUser(user);
  }
}
