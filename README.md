# NPM Trends - Frontend Client ([npmtrends.com](http://www.npmtrends.com))

NPM package comparison app

## Why?

NPM Trends was initially built in late 2015 when I was just getting into frontend development. Coming from a background in Rails, I was frustrated with how many decisions you had to make early on as a javascript developer. I didn't give an F what my build tool was, I just wanted to get a web app in front of users as quickly as possible. I'm a startup founder first and a web developer second.

I didn't want to have to worry that 6 months down the road, the framework that I decided to use wouldn't be supported anymore. I wanted a way to see what packages were being used and what way their use was trending. My hypothesis was that you could use the change in download counts over time to predict whether the developer community of a given package or library would be strong for the foreseeable future.

This approach paid off early on when NPM Trends led me to choose Redux over the multitude of other Flux frameworks out at the time. When I looked at the download trends in November of 2015, I saw Redux beginning to pull away from the pack. If you look at the stats now, there is no comparison.

![Redux Trend Graph](/app/assets/images/ReduxTrendGraph.png?raw=true)

You shouldn't use an NPM package solely based on the number of downloads the package has, but it should definitely be another data point in your decision making process. Hopefully NPM Trends will help you make better decisions, so you can spend less time jumping from package to package and more time building meaningful applications.

Cheers! 🍻
