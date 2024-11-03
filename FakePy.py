from cwru.ccc.ctf import LoginManager, Session, Link, Info
from cwru.ccc.WebKit import Click, Webpage
from numpy import ndarray
from Info import _InfoKey

import Literal
import overload

def get_latest_key(name: Literal["ctf", "ruleset", "source"], /) -> _InfoKey: ...
def ctf() -> float: ...
def ruleset() -> ndarray[str, float]: ...
def source() -> bytes: ...

class Homepage(Webpage):
    info: Info.MD_Object
    session: Session.Certificate

    def __init__():

    @overload
    def __init__(*args, **kwargs):

    @staticmethod
    def about(info: Info.about.Versions.Latest):


    @classmethod
    def leaderboard(cls, cert: Session.c, rdr: Link.Redirect) -> Link.GoTo:


    @classmethod
    def get_started(cls, login: LoginManager.Login, cert: Session.c, *args, **kwargs) -> Link.Popup:


    def sign_up(self, login: LoginManager.NewLogin, cert: Session.c, rdr: Link.Redirect) -> Link.GoTo:

    def log_in(self,login: LoginManager.Login, cert: Session.c) -> Link.GoTo:


async def main(*args) -> Link.Redirect:
    home = Homepage()
    mouse = Click.GetMouse(home)
    user_options = {
        "Log In"     : home.log_in(Click.from_header(home.log_in),                   *args),
        "Sign Up"    : home.sign_up(Click.from_header(home.sign_up),                 *args),
        "Get Started": home.get_started(Click.from_header(home.get_started),         *args),
        "About"      : Homepage.about(Click.from_header(Homepage.about),             *args),
        "Leaderboard": Homepage.leaderboard(Click.from_header(Homepage.leaderboard), *args),
    }
    clicked: str = await Click.UserInput(mouse)
    return user_options[clicked]


if "__main__":
    main()