#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/runtime:7.0 AS base
WORKDIR /app

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["ClaimsWorkerService/ClaimsWorkerService.csproj", "ClaimsWorkerService/"]
RUN dotnet restore "ClaimsWorkerService/ClaimsWorkerService.csproj"
COPY . .
WORKDIR "/src/ClaimsWorkerService"
RUN dotnet build "ClaimsWorkerService.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ClaimsWorkerService.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ClaimsWorkerService.dll"]