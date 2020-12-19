FROM mcr.microsoft.com/dotnet/core/aspnet:2.1-stretch-slim AS base

WORKDIR /app
EXPOSE 80
EXPOSE 443
COPY . .

ENTRYPOINT ["dotnet", "App.dll"]