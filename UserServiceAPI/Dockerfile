# Etapa BUILD
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

COPY UserServiceAPI/*.csproj ./ 
RUN dotnet restore

COPY UserServiceAPI/. .
RUN dotnet publish -c Release -o /app/publish --no-restore

# Etapa RUNTIME
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://0.0.0.0:5161
EXPOSE 5161

ENTRYPOINT ["dotnet", "UserServiceAPI.dll"]
